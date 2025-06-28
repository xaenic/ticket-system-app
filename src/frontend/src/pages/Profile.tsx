import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "@/services/auth.service";
import { BASE_API_URL } from "@/utils/api";

// Form schemas
const profileSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    currentPassword: z.string().min(1, {
      message: "Please enter your current password to confirm changes",
    }),
    new_password: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If new password is provided, confirm password must also be provided and match
      if (data.new_password || data.confirmNewPassword) {
        if (!data.new_password || data.new_password.length < 6) {
          return false;
        }
        return data.new_password === data.confirmNewPassword;
      }
      return true;
    },
    {
      message:
        "New passwords don't match or password is too short (minimum 6 characters)",
      path: ["confirmNewPassword"],
    }
  );

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, checkAuthStatus } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      currentPassword: "",
      new_password: "",
      confirmNewPassword: "",
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    try {

      const {name,currentPassword,new_password} = data;
      await updateProfile(name,currentPassword,new_password || null, selectedFile || null);
      checkAuthStatus();
      profileForm.reset();
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof Object) {
        Object.entries(error).forEach(
          ([field, msgArray]: [string, string[]]) => {
            profileForm.setError(field as keyof z.infer<typeof profileSchema>, {
              type: "server",
              message: Array.isArray(msgArray) ? msgArray.join(", ") : msgArray,
            });
          }
        );
      }else
      toast.error("Something went wrong");
    }
    setIsUpdatingProfile(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen p-4 space-y-6 w-full bg-gradient-to-tr from-blue-50 to-purple-50 w-full p-6 ">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile name, avatar and password settings
        </p>
      </div>

      <div className="grid gap-6">
        {/* Avatar Section */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Click on your avatar to change your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  className="h-24 w-24 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage
                    src={selectedImage || `${BASE_API_URL?.replace("/api","/storage/")}${user?.avatar}`}
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-blue-500 text-white text-xl">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors"
                  onClick={handleAvatarClick}
                >
                  <Camera size={16} className="text-white" />
                </div>
              </div>
              <div>
                {selectedImage ? (
                  <>
                    <p className="text-sm text-gray-600 font-medium">
                      New image selected
                    </p>
                    <p className="text-xs text-gray-500">
                      Click "Update Profile" below to save changes
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Click to upload a new avatar
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                  </>
                )}
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information, avatar, and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="mt-1 bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contact your administrator to change your email
                  </p>
                </div>

                {user?.department && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <Input
                      value={user.department.name || ""}
                      disabled
                      className="mt-1 bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your assigned department
                    </p>
                  </div>
                )}

                {selectedImage && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-700">
                      New avatar image selected
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedImage(null);
                        setSelectedFile(null);
                      }}
                      className="ml-auto text-blue-600 hover:text-blue-800"
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <FormField
                  control={profileForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your current password to confirm changes"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Required to confirm any changes
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Change Password (Optional)
                  </h4>
                  <div className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password (optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full sm:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdatingProfile ? "Updating..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

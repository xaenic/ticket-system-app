import loaderAnimation from "@/assets/LineLoading.json";
import Lottie from "lottie-react";
export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 h-72">
        <Lottie animationData={loaderAnimation} loop autoplay />
      </div>
    </div>
  );
};

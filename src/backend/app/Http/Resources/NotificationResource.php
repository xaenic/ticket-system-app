<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class NotificationResource extends JsonResource
{
    /**
     * Transform the notification into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return array_merge([
            'id' => $this->id,
            'read_at' => $this->read_at ? Carbon::parse($this->read_at)->format('Y-m-d H:i:s') : null,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
        ], $this->data);
    }
}

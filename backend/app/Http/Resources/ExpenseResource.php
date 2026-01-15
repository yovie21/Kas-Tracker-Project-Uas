<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'amount' => $this->amount,
            'date' => $this->date
                ? $this->date->timezone('Asia/Jakarta')->format('Y-m-d H:i:s')
                : null,
            'created_at' => $this->created_at
                ? $this->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i:s')
                : null,
        ];

    }

}

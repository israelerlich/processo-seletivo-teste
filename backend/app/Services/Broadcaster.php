<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class Broadcaster
{
    public function pollUpdated(array $poll): void
    {
        $url = config('services.websocket.url');

        if (! $url) {
            return;
        }

        try {
            Http::timeout(2)->post($url, [
                'secret' => config('services.websocket.secret'),
                'poll' => $poll,
            ]);
        } catch (Throwable $exception) {
            Log::warning('Não foi possível avisar o servidor WebSocket: '.$exception->getMessage());
        }
    }
}

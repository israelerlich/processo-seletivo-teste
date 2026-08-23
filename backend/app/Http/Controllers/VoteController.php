<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Services\Broadcaster;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function store(Request $request, Poll $poll, Broadcaster $broadcaster)
    {
        $data = $request->validate([
            'option_id' => ['required', 'integer'],
            'voter_id' => ['required', 'string', 'max:64'],
        ]);

        if ($poll->isClosed()) {
            return response()->json(['message' => 'Esta enquete já foi encerrada.'], 422);
        }

        $option = $poll->options()->find($data['option_id']);

        if (! $option) {
            return response()->json(['message' => 'Opção inválida para esta enquete.'], 422);
        }

        if ($poll->votes()->where('voter_id', $data['voter_id'])->exists()) {
            return response()->json(['message' => 'Você já votou nesta enquete.'], 422);
        }

        $poll->votes()->create([
            'poll_option_id' => $option->id,
            'voter_id' => $data['voter_id'],
        ]);

        $results = $poll->toResults();

        $broadcaster->pollUpdated($results);

        return response()->json($results, 201);
    }
}

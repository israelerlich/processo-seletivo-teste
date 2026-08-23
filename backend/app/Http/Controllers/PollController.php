<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use Illuminate\Http\Request;

class PollController extends Controller
{
    public function index()
    {
        return Poll::latest()->get()->map(function (Poll $poll) {
            return [
                'id' => $poll->id,
                'question' => $poll->question,
                'closed' => $poll->isClosed(),
            ];
        });
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'options' => ['required', 'array', 'min:2', 'max:6'],
            'options.*' => ['required', 'string', 'max:120'],
            'duration_seconds' => ['nullable', 'integer', 'min:10', 'max:3600'],
        ]);

        $poll = Poll::create([
            'question' => $data['question'],
            'closes_at' => isset($data['duration_seconds'])
                ? now()->addSeconds($data['duration_seconds'])
                : null,
        ]);

        foreach ($data['options'] as $text) {
            $poll->options()->create(['text' => $text]);
        }

        return response()->json($poll->toResults(), 201);
    }

    public function show(Poll $poll)
    {
        return $poll->toResults();
    }
}

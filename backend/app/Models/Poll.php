<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    protected $fillable = [
        'question',
        'closes_at',
    ];

    protected $casts = [
        'closes_at' => 'datetime',
    ];

    public function options(): HasMany
    {
        return $this->hasMany(PollOption::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function isClosed(): bool
    {
        return $this->closes_at !== null && $this->closes_at->isPast();
    }

    public function toResults(): array
    {
        $options = $this->options()->withCount('votes')->orderBy('id')->get();
        $total = (int) $options->sum('votes_count');

        return [
            'id' => $this->id,
            'question' => $this->question,
            'closes_at' => $this->closes_at?->toIso8601String(),
            'closed' => $this->isClosed(),
            'total_votes' => $total,
            'options' => $options->map(function ($option) use ($total) {
                return [
                    'id' => $option->id,
                    'text' => $option->text,
                    'votes' => (int) $option->votes_count,
                    'percentage' => $total > 0 ? round($option->votes_count * 100 / $total, 1) : 0,
                ];
            })->all(),
        ];
    }
}

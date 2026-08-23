<?php

namespace Tests\Feature;

use App\Models\Poll;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VoteTest extends TestCase
{
    use RefreshDatabase;

    public function test_o_mesmo_votante_nao_pode_votar_duas_vezes(): void
    {
        Sanctum::actingAs(User::create([
            'name' => 'Usuário Teste',
            'email' => 'teste@example.com',
            'password' => 'senha1234',
        ]));

        $poll = Poll::create(['question' => 'Qual framework você prefere?']);
        $option = $poll->options()->create(['text' => 'Laravel']);

        $primeiro = $this->postJson("/api/polls/{$poll->id}/votes", [
            'option_id' => $option->id,
            'voter_id' => 'votante-1',
        ]);

        $segundo = $this->postJson("/api/polls/{$poll->id}/votes", [
            'option_id' => $option->id,
            'voter_id' => 'votante-1',
        ]);

        $primeiro->assertCreated();
        $segundo->assertStatus(422);
        $this->assertSame(1, $poll->votes()->count());
    }

    public function test_rota_de_voto_exige_autenticacao(): void
    {
        $poll = Poll::create(['question' => 'Qual framework você prefere?']);
        $option = $poll->options()->create(['text' => 'Laravel']);

        $this->postJson("/api/polls/{$poll->id}/votes", [
            'option_id' => $option->id,
            'voter_id' => 'votante-1',
        ])->assertStatus(401);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@fantasydraft.com.br'],
            ['name' => 'Usuário Demo', 'password' => 'demo1234']
        );

        $user->tokens()->delete();

        $user->tokens()->create([
            'name' => 'frontend-demo',
            'token' => hash('sha256', 'demotoken'),
            'abilities' => ['*'],
        ]);

        $this->command->info('Token da API: demotoken');
    }
}

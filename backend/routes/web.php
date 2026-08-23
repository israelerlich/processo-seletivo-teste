<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['api' => 'mural-de-enquetes']);
});

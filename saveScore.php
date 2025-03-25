<?php
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name']) && isset($data['score'])) {
    $entry = $data['name'] . " - " . $data['score'] . PHP_EOL;
    if (file_put_contents("score.txt", $entry, FILE_APPEND) !== false) {
        echo "Pontuação salva com sucesso!";
    } else {
        http_response_code(500);
        echo "Erro ao salvar no arquivo!";
    }
} else {
    http_response_code(400);
    echo "Dados inválidos!";
}
?>

1- Alterar parâmetro 'scriptSql' para o sql que deseja utilizar
2- Instale biblioteca pg do node com 'npm install pg'
3- Executar o script com comando 'node sql.js'

Criar um arquivo json com esse estilo, e alterar no arquivo sql.js a variavel configFile
[
    {
        "url": "jdbc:postgresql://host:port/sid",
        "user": "user",
        "password": "password"
    }
]

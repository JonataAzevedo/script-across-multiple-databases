const { Pool } = require('pg');
const fs = require('fs');

const configFile = './db.config.json';

const scriptSql = `
DO $$
	DECLARE
	   qtd INT = 0;
	begin
	  	SELECT count(*) INTO qtd FROM autenticacao.t_usuario WHERE email = 'reginaldo.barbara@izatta.tech';
		IF qtd <= 0 THEN
			INSERT INTO autenticacao.t_usuario (nome, email, login, valor_senha, reset_token_senha, tentativas_erro_senha, data_ultima_alteracao_senha, status, id_usuario_atualizacao, data_atualizacao, "version")
			VALUES('Reginaldo Barbara', 'reginaldo.barbara@izatta.tech', 'reginaldo.barbara', null, 'reset-token$2020-reginaldo.barbara', 0, null, 'PENDENTE'::character varying, 0, null, 0);
			INSERT INTO autenticacao.t_usuario_grupo (id_usuario, id_grupo) 
			VALUES ((SELECT id FROM autenticacao.t_usuario WHERE login = 'reginaldo.barbara'), 5);
		END IF;
	END $$;
`;

(async () => {
    const results = [];
    try {
        const dbConfigs = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

        for (const config of dbConfigs) {
            const { url, user, password } = config;

            const match = url.match(/jdbc:postgresql:\/\/([^:]+):(\d+)\/(.+)/);
            if (!match) {
                console.error(`URL inválida: ${url}`);
                results.push({ url, status: 'URL inválida' });
                continue;
            }

            const [_, host, port, database] = match;


            const pool = new Pool({
                host,
                port,
                database,
                user,
                password,
            });

            try {
                console.log(`Conectando ao banco ${url}...`);
                const client = await pool.connect();
                await client.query(scriptSql);
                console.log(`Script executado com sucesso no banco ${url}`);
                results.push({ url, status: 'OK' });
                client.release();
            } catch (err) {
                console.error(`Erro ao executar script no banco ${url}:`, err.message);
                results.push({ url, status: `Erro: ${err.message}` });
            } finally {
                await pool.end();
            }
        }
    } catch (err) {
        console.error('Erro ao processar o arquivo de configuração:', err.message);
    }

    console.log('\nResumo da Execução:');
    results.forEach(result => {
        console.log(`Banco: ${result.url} - Status: ${result.status}`);
    });
})();
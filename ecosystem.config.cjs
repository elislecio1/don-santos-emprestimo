/**
 * PM2 Ecosystem Configuration
 * Don Santos - Correspondente Bancário
 * 
 * Uso:
 *   pm2 start ecosystem.config.cjs
 *   pm2 restart don-santos
 *   pm2 stop don-santos
 *   pm2 logs don-santos
 *   pm2 monit
 */

module.exports = {
  apps: [
    {
      // Nome da aplicação
      name: 'don-santos',
      
      // Script de entrada (após build)
      script: 'dist/index.js',
      
      // Diretório de trabalho
      cwd: '/www/wwwroot/don.cim.br',
      
      // Número de instâncias (0 = usar todos os CPUs)
      instances: 1,
      
      // Modo de execução
      exec_mode: 'fork',
      
      // Reiniciar automaticamente em caso de falha
      autorestart: true,
      
      // Observar mudanças nos arquivos (desativado em produção)
      watch: false,
      
      // Limite de memória para reinício automático
      max_memory_restart: '500M',
      
      // Variáveis de ambiente para produção
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Variáveis de ambiente para desenvolvimento
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      
      // Configurações de log
      log_file: '/www/wwwroot/don.cim.br/logs/combined.log',
      out_file: '/www/wwwroot/don.cim.br/logs/out.log',
      error_file: '/www/wwwroot/don.cim.br/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Mesclar logs de todas as instâncias
      merge_logs: true,
      
      // Tempo de espera antes de considerar a app como "online"
      min_uptime: '10s',
      
      // Número máximo de reinícios em caso de falha
      max_restarts: 10,
      
      // Tempo de espera entre reinícios
      restart_delay: 4000,
      
      // Tempo de espera para graceful shutdown
      kill_timeout: 5000,
      
      // Aguardar a app estar pronta antes de considerar online
      wait_ready: false,
      
      // Tempo limite para a app ficar pronta
      listen_timeout: 8000,
      
      // Configurações de cluster (se usar instances > 1)
      instance_var: 'INSTANCE_ID',
      
      // Interpretar como módulo ES
      node_args: '--experimental-specifier-resolution=node',
    },
  ],
  
  // Configuração de deploy (opcional)
  deploy: {
    production: {
      // Usuário SSH
      user: 'root',
      
      // Host do servidor
      host: 'don.cim.br',
      
      // Branch do Git
      ref: 'origin/main',
      
      // Repositório Git
      repo: 'https://github.com/elislecio1/don-santos-emprestimo.git',
      
      // Diretório de deploy
      path: '/www/wwwroot/don.cim.br',
      
      // Comandos pós-deploy
      'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.cjs --env production',
      
      // Variáveis de ambiente
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};

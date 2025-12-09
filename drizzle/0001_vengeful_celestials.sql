CREATE TABLE `loan_factors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`prazo` int NOT NULL,
	`dia` int NOT NULL,
	`fator` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loan_factors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`valorEmprestimo` varchar(20) NOT NULL,
	`valorParcela` varchar(20) NOT NULL,
	`prazo` int NOT NULL,
	`fatorUtilizado` varchar(20) NOT NULL,
	`nomeCompleto` varchar(255) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`dataNascimento` varchar(10) NOT NULL,
	`rgOuCnh` varchar(30) NOT NULL,
	`filiacao` varchar(255) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`cep` varchar(10) NOT NULL,
	`logradouro` varchar(255) NOT NULL,
	`numero` varchar(20) NOT NULL,
	`complemento` varchar(100),
	`bairro` varchar(100) NOT NULL,
	`cidade` varchar(100) NOT NULL,
	`estado` varchar(2) NOT NULL,
	`banco` varchar(100) NOT NULL,
	`agencia` varchar(20) NOT NULL,
	`conta` varchar(30) NOT NULL,
	`tipoConta` enum('corrente','poupanca') NOT NULL DEFAULT 'corrente',
	`rgFrenteUrl` text,
	`rgVersoUrl` text,
	`comprovanteResidenciaUrl` text,
	`selfieUrl` text,
	`googleDriveFolderId` varchar(100),
	`googleDriveFolderUrl` text,
	`status` enum('pendente','em_analise','aprovado','recusado') NOT NULL DEFAULT 'pendente',
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);

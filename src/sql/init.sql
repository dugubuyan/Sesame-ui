CREATE DATABASE IF NOT EXISTS payroll;
USE payroll;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID，主键，唯一，递增',
  `user_name` VARCHAR(128) DEFAULT '' NOT NULL,
  `address` VARCHAR(128) DEFAULT '' NOT NULL,
  `user_status` TINYINT DEFAULT '0' NOT NULL COMMENT '0-正常,1-注销，2-暂停',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_address` (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID，主键，唯一，递增',
  `name` VARCHAR(128) DEFAULT '' NOT NULL,
  `address` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '员工钱包地址',
  `base_salary` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '基本工资',
  `status` TINYINT DEFAULT '0' NOT NULL COMMENT '0-在职,1-离职',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_address` (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `payroll`;
CREATE TABLE `payroll` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID，主键，唯一，递增',
  `employee_id` bigint NOT NULL COMMENT '员工ID',
  `base_salary` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '基本工资',
  `bonus` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '奖金',
  `total` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '总工资',
  `payment_date` date NOT NULL COMMENT '发薪日期',
  `status` TINYINT DEFAULT '0' NOT NULL COMMENT '0-待发放,1-已发放,2-发放失败',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `payroll_history`;
CREATE TABLE `payroll_history` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID，主键，唯一，递增',
  `payroll_id` bigint NOT NULL COMMENT '工资ID',
  `employee_id` bigint NOT NULL COMMENT '员工ID',
  `transaction_hash` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '交易哈希',
  `status` TINYINT DEFAULT '0' NOT NULL COMMENT '0-处理中,1-成功,2-失败',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payroll_id` (`payroll_id`),
  KEY `idx_employee_id` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID，主键，唯一，递增',
  `name` VARCHAR(128) DEFAULT '' NOT NULL,
  `address` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '成员钱包地址',
  `role` TINYINT DEFAULT '0' NOT NULL COMMENT '0-普通成员,1-管理员',
  `status` TINYINT DEFAULT '0' NOT NULL COMMENT '0-正常,1-禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_address` (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
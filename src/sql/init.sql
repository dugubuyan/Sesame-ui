CREATE DATABASE IF NOT EXISTS payroll;
USE payroll;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID，主键，唯一，递增',
  `user_name` VARCHAR(128) DEFAULT '' NOT NULL,
  `address` VARCHAR(128) DEFAULT '' NOT NULL,
  `safe_account` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '组织安全账户地址',
  `user_status` TINYINT DEFAULT '0' NOT NULL COMMENT '0-正常,1-注销，2-暂停',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_address` (`address`),
  KEY `idx_safe_account` (`safe_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `payroll`;
CREATE TABLE `payroll` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID，主键，唯一，递增',
  `name` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '员工姓名',
  `address` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '员工钱包地址',
  `safe_account` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '组织安全账户地址',
  `base_salary` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '基本工资',
  `bonus` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '奖金',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_address_safe` (`address`, `safe_account`),
  KEY `idx_safe_account` (`safe_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `payroll_history`;
CREATE TABLE `payroll_history` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID，主键，唯一，递增',
  `employee_id` bigint NOT NULL COMMENT '员工ID',
  `employee_name` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '员工姓名',
  `address` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '员工钱包地址',
  `safe_account` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '组织安全账户地址',
  `base_salary` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '基本工资',
  `bonus` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '奖金',
  `total` decimal(20,2) DEFAULT '0.00' NOT NULL COMMENT '总工资',
  `payment_time` datetime NOT NULL COMMENT '支付时间',
  `transaction_hash` VARCHAR(128) DEFAULT '' NOT NULL COMMENT '交易哈希',
  `status` TINYINT DEFAULT '0' NOT NULL COMMENT '0-处理中,1-成功,2-失败',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_safe_account` (`safe_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
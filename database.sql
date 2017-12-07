DROP TABLE IF EXISTS `usuari`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_type` smallint(3) NOT NULL COMMENT '1 -> Administrador, 2-> professor, 3->Alumne',
  `password` varchar(100) NULL default NULL,
  `user_last_connection` varchar(25) NOT NULL,
  `registration_code` varchar(255) NULL default NULL,
  `active` tinyint(1) NOT NULL COMMENT '1 -> actu 0 -> no actiu',
  `udg_code` varchar(25) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
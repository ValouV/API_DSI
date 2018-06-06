-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le :  mer. 06 juin 2018 à 14:37
-- Version du serveur :  5.6.38
-- Version de PHP :  7.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `Inventaire_DSI`
--

-- --------------------------------------------------------

--
-- Structure de la table `alertepret`
--

CREATE TABLE `alertepret` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `message` varchar(1000) NOT NULL,
  `lu` tinyint(1) NOT NULL,
  `type` int(11) NOT NULL,
  `idHistoriquePret` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `alertepret`
--

INSERT INTO `alertepret` (`id`, `date`, `message`, `lu`, `type`, `idHistoriquePret`) VALUES
(1, '2018-06-02 00:00:00', 'L\'objet de type \"écran\" prêté à Victor Aguer est en retard. Un mail lui a été transmis.', 1, 0, 2);

-- --------------------------------------------------------

--
-- Structure de la table `alertestock`
--

CREATE TABLE `alertestock` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `message` varchar(1000) NOT NULL,
  `lu` tinyint(1) NOT NULL,
  `type` int(11) NOT NULL,
  `idHistoriqueStock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `alertestock`
--

INSERT INTO `alertestock` (`id`, `date`, `message`, `lu`, `type`, `idHistoriqueStock`) VALUES
(1, '2018-05-15 10:00:00', 'Vous avez atteint la limite fixée pour les objets de type \"écran\" dans les stocks sur le site de Sceaux', 1, 0, 10);

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id`, `nom`) VALUES
(1, 'écran 10 pouces'),
(2, 'adaptateur VGA / HDMI'),
(3, 'souris usb');

-- --------------------------------------------------------

--
-- Structure de la table `catlimite`
--

CREATE TABLE `catlimite` (
  `id` int(11) NOT NULL,
  `limite` int(11) NOT NULL,
  `idCategorie` int(11) NOT NULL,
  `siteEPF` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `catlimite`
--

INSERT INTO `catlimite` (`id`, `limite`, `idCategorie`, `siteEPF`) VALUES
(1, 4, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `historiquepret`
--

CREATE TABLE `historiquepret` (
  `id` int(11) NOT NULL,
  `depart` datetime NOT NULL,
  `retourPrevu` datetime NOT NULL,
  `retourEffectif` datetime DEFAULT NULL,
  `idUserAdmin` int(11) NOT NULL,
  `idObjet` int(11) NOT NULL,
  `idUserHelisa` varchar(255) NOT NULL,
  `siteEPF` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `historiquepret`
--

INSERT INTO `historiquepret` (`id`, `depart`, `retourPrevu`, `retourEffectif`, `idUserAdmin`, `idObjet`, `idUserHelisa`, `siteEPF`) VALUES
(1, '2018-05-27 11:00:00', '2018-07-03 00:00:00', '2018-07-03 00:00:00', 1, 9, 'E03879', 1),
(2, '2018-05-29 08:00:00', '2018-06-01 13:00:00', NULL, 1, 10, 'E03879', 1);

-- --------------------------------------------------------

--
-- Structure de la table `historiquestock`
--

CREATE TABLE `historiquestock` (
  `id` int(11) NOT NULL,
  `arrivée` datetime NOT NULL,
  `depart` datetime DEFAULT NULL,
  `idUserAdmin` int(11) NOT NULL,
  `idObjet` int(11) NOT NULL,
  `siteEPF` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `historiquestock`
--

INSERT INTO `historiquestock` (`id`, `arrivée`, `depart`, `idUserAdmin`, `idObjet`, `siteEPF`) VALUES
(1, '2018-05-01 15:00:00', NULL, 1, 1, 1),
(2, '2018-05-01 15:05:00', NULL, 1, 2, 1),
(3, '2018-05-01 15:10:00', NULL, 1, 3, 1),
(4, '2018-05-01 16:00:00', NULL, 1, 4, 1),
(9, '2018-05-01 14:00:00', '2018-05-10 10:00:00', 1, 5, 1),
(10, '2018-05-01 17:00:00', '2018-05-15 10:00:00', 1, 6, 1),
(11, '2018-05-18 15:00:00', NULL, 3, 6, 2);

-- --------------------------------------------------------

--
-- Structure de la table `objet`
--

CREATE TABLE `objet` (
  `id` int(11) NOT NULL,
  `actif` tinyint(1) NOT NULL,
  `isStock` tinyint(1) NOT NULL,
  `commentaire` varchar(1000) NOT NULL,
  `siteEPF` int(11) NOT NULL,
  `idCategorie` int(11) NOT NULL,
  `idUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `objet`
--

INSERT INTO `objet` (`id`, `actif`, `isStock`, `commentaire`, `siteEPF`, `idCategorie`, `idUser`) VALUES
(1, 1, 1, '', 1, 1, 1),
(2, 1, 1, '', 1, 1, 1),
(3, 1, 1, '', 1, 1, 1),
(4, 1, 1, '', 1, 1, 1),
(5, 0, 1, '', 1, 1, 1),
(6, 1, 1, '', 2, 1, 3),
(7, 1, 1, '', 1, 2, 1),
(8, 1, 1, '', 1, 3, 1),
(9, 1, 0, '', 1, 3, 1),
(10, 1, 0, '', 1, 3, 1),
(11, 0, 0, 'Cassé lors d\'un prêt', 1, 3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `uHelisa`
--

CREATE TABLE `uHelisa` (
  `ID_ETUDIANT` varchar(255) NOT NULL,
  `APPRENANT_PRENOM` varchar(255) NOT NULL,
  `APPRENANT_NOM` varchar(255) NOT NULL,
  `PHOTO_IDENTITE` varchar(255) NOT NULL,
  `EMAIL` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `uHelisa`
--

INSERT INTO `uHelisa` (`ID_ETUDIANT`, `APPRENANT_PRENOM`, `APPRENANT_NOM`, `PHOTO_IDENTITE`, `EMAIL`) VALUES
('E03879', 'Victor', 'AGUER', 'aguervictor.jpg', 'victor.aguer@epfedu.fr'),
('E04493', 'David', 'BERNADET', 'bernadetdavid.jpg', 'david.bernadet@epfedu.fr'),
('E04512', 'Alexandre', 'DANTY', 'dantyalexandre.jpg', 'alexandre.danty@epfedu.fr'),
('E04770', 'Lancelot', 'DEGUERRE', 'deguerrelancelot.jpg', 'lancelot.deguerre@epfedu.fr'),
('E04224', 'Louis', 'RIOU', 'rioulouis.jpg', 'louis.riou@epfedu.fr'),
('E04804', 'Valentin', 'VASSAS', 'vassasvalentin.jpg', 'valentin.vassas@epfedu.fr'),
('E04731', 'Laurène', 'YVIQUEL', 'yviquellaurene.jpg', 'laurene.yviquel@epfedu.fr');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `password` varchar(500) NOT NULL,
  `role` int(11) NOT NULL,
  `siteEPF` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `nom`, `prenom`, `password`, `role`, `siteEPF`) VALUES
(1, 'admin', 'admin', 'admin', '91f5e1599852db9768a6e3a2a0cfd81436805ad55575c388ff5e99e55ee8e4e8', 1, 1),
(2, 'administrationepf', 'administrationepf', 'administrationepf', '168e062e036b20bff83e79fc49a34783369eee429b129d770ad966629a6f888b', 3, 1),
(3, 'admintroyes', 'admintroyes', 'admintroyes', 'e00b6c07ee21adad0c6d9db33239827d79ff1d89fb7db3a808f1b0abfdcaeb49', 2, 2),
(4, 'adminmtp', 'adminmtp', 'adminmtp', 'e2277c6be8735e97b66bd20f33c68e91931f8fc798bf041059f5bca0d97e83dc', 2, 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `alertepret`
--
ALTER TABLE `alertepret`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `alertestock`
--
ALTER TABLE `alertestock`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `catlimite`
--
ALTER TABLE `catlimite`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `historiquepret`
--
ALTER TABLE `historiquepret`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `historiquestock`
--
ALTER TABLE `historiquestock`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `objet`
--
ALTER TABLE `objet`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `alertepret`
--
ALTER TABLE `alertepret`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `alertestock`
--
ALTER TABLE `alertestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `catlimite`
--
ALTER TABLE `catlimite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `historiquepret`
--
ALTER TABLE `historiquepret`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `historiquestock`
--
ALTER TABLE `historiquestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `objet`
--
ALTER TABLE `objet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

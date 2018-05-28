-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le :  lun. 28 mai 2018 à 22:21
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
(1, '2018-05-18 00:00:00', 'Test d\'alerte', 1, 1, 2),
(2, '2018-05-28 00:00:00', 'Test LAurène tes grands morts', 1, 1, 2);

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
(1, '2018-05-28 00:00:00', 'Test alerte stock', 1, 1, 2);

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
(2, 'écran 25 pouces'),
(3, 'écran 25 pouces'),
(4, 'cuillère');

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
(2, 20, 2, 2),
(3, 10, 3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `historiquepret`
--

CREATE TABLE `historiquepret` (
  `id` int(11) NOT NULL,
  `depart` datetime NOT NULL,
  `retourPrevu` datetime NOT NULL,
  `retourEffectif` datetime NOT NULL,
  `idUserAdmin` int(11) NOT NULL,
  `idObjet` int(11) NOT NULL,
  `idUserHelisa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `historiquepret`
--

INSERT INTO `historiquepret` (`id`, `depart`, `retourPrevu`, `retourEffectif`, `idUserAdmin`, `idObjet`, `idUserHelisa`) VALUES
(2, '2018-05-20 20:00:00', '2018-05-21 20:00:00', '0000-00-00 00:00:00', 1, 2, 1),
(3, '2018-05-02 00:00:00', '2018-05-03 00:00:00', '2018-05-04 00:00:00', 3, 10004, 1);

-- --------------------------------------------------------

--
-- Structure de la table `historiquestock`
--

CREATE TABLE `historiquestock` (
  `id` int(11) NOT NULL,
  `arrivée` datetime NOT NULL,
  `depart` datetime NOT NULL,
  `idUserAdmin` int(11) NOT NULL,
  `idObjet` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `historiquestock`
--

INSERT INTO `historiquestock` (`id`, `arrivée`, `depart`, `idUserAdmin`, `idObjet`) VALUES
(2, '2018-05-21 21:00:00', '2018-05-21 21:50:00', 2, 2),
(3, '2018-05-21 21:00:00', '0000-00-00 00:00:00', 1, 1),
(4, '2018-05-21 21:00:00', '0000-00-00 00:00:00', 1, 1),
(5, '2018-05-21 21:00:00', '0000-00-00 00:00:00', 1, 1),
(6, '2018-05-21 21:00:00', '0000-00-00 00:00:00', 1, 1),
(7, '2018-05-21 21:00:00', '0000-00-00 00:00:00', 1, 1),
(8, '2018-05-21 21:00:00', '0000-00-00 00:00:00', 1, 1),
(9, '0000-00-00 00:00:00', '2018-05-28 19:32:38', 3, 2),
(10, '0000-00-00 00:00:00', '2018-05-28 19:33:55', 3, 2),
(11, '2018-05-28 19:35:08', '2018-05-28 19:35:45', 3, 2),
(12, '2018-05-28 19:36:51', '0000-00-00 00:00:00', 3, 2);

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
(2, 1, 0, 'ça a marché batard', 1, 1, 3),
(10000, 1, 1, 'yo', 1, 10, 10),
(10001, 4, 1, 'ah', 4, 4, 1),
(10002, 4, 1, 'ah', 4, 4, 1),
(10003, 0, 0, 'Nouvel objet numéro 353', 1, 1, 1),
(10004, 1, 0, 'Test ajout', 1, 4, 3),
(10005, 1, 0, 'Test ajout', 1, 4, 3),
(10006, 1, 0, 'Test ajout', 1, 4, 3),
(10007, 1, 0, 'Test ajout', 1, 4, 3),
(10008, 1, 0, 'Test ajout', 1, 4, 3),
(10009, 1, 0, 'Test ajout', 1, 4, 3),
(10010, 1, 0, 'Test ajout', 1, 4, 3),
(10011, 1, 0, 'Test ajout', 1, 1, 3),
(10012, 1, 0, 'Test ajout', 1, 2, 3),
(10013, 1, 0, 'Test ajout', 1, 2, 3);

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
('E03879', 'AGUER', 'Victor', 'aguervictor.jpg', 'victor.aguer@epfedu.fr'),
('E04493', 'BERNADET', 'David', 'bernadetdavid.jpg', 'david.bernadet@epfedu.fr'),
('E04512', 'DANTY', 'Alexandre', 'dantyalexandre.jpg', 'alexandre.danty@epfedu.fr'),
('E04770', 'DEGUERRE', 'Lancelot', 'deguerrelancelot.jpg', 'lancelot.deguerre@epfedu.fr'),
('E04224', 'RIOU', 'Louis', 'rioulouis.jpg', 'louis.riou@epfedu.fr'),
('E04804', 'VASSAS', 'Valentin', 'vassasvalentin.jpg', 'valentin.vassas@epfedu.fr'),
('E04731', 'YVIQUEL', 'Laurène', 'yviquellaurene.jpg', 'laurene.yviquel@epfedu.fr');

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
(1, 'email', 'nom1', 'prenom1', '', 0, 0),
(2, 'email2', 'nom2', 'prenom2', '', 1, 0),
(3, 'admin', 'admin', 'admin', 'admin', 1, 1),
(4, 'test@test', 'test', 'test', 'test', 1, 1),
(5, 'test@test', 'test', 'test', 'test', 1, 1),
(6, 'test@test', 'test', 'test', 'test', 1, 1),
(7, 'test@test', 'test', 'test', 'test', 1, 1),
(8, 'test@test', 'test', 'test', 'test', 1, 1),
(9, 'test@test', 'test', 'test', 'test', 1, 1),
(10, 'test@test', 'test', 'test', 'test', 1, 1),
(11, 'test@test', 'test', 'test', 'test', 1, 1),
(12, 'tes', 'test', 'test', 'test', 1, 1),
(13, 'tes', 'test', 'test', 'test', 1, 1),
(14, 'tes', 'test', 'test', 'test', 1, 1),
(15, 'tes', 'test', 'test', 'test', 1, 1),
(16, 'test@', 'test', 'test', 'test', 1, 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `alertestock`
--
ALTER TABLE `alertestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `catlimite`
--
ALTER TABLE `catlimite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `historiquepret`
--
ALTER TABLE `historiquepret`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `historiquestock`
--
ALTER TABLE `historiquestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `objet`
--
ALTER TABLE `objet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10014;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

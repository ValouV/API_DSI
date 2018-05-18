-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le :  ven. 18 mai 2018 à 15:40
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

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `marque` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `helisa`
--

CREATE TABLE `helisa` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(1007, 0, 0, 'Nouvel objet numéro 353', 1, 1, 1),
(10000, 1, 1, 'yo', 1, 10, 10),
(10001, 4, 1, 'ah', 4, 4, 1),
(10002, 4, 1, 'ah', 4, 4, 1);

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
(3, 'admin', 'admin', 'admin', 'admin', 1, 1);

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
-- Index pour la table `helisa`
--
ALTER TABLE `helisa`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `alertestock`
--
ALTER TABLE `alertestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `helisa`
--
ALTER TABLE `helisa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `historiquepret`
--
ALTER TABLE `historiquepret`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `historiquestock`
--
ALTER TABLE `historiquestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `objet`
--
ALTER TABLE `objet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10003;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Sam 12 Mai 2018 à 17:34
-- Version du serveur :  5.7.14
-- Version de PHP :  7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `bddv1`
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
-- Contenu de la table `objet`
--

INSERT INTO `objet` (`id`, `actif`, `isStock`, `commentaire`, `siteEPF`, `idCategorie`, `idUser`) VALUES
(1007, 1, 2, 'aaaa', 3, 2, 3),
(10000, 1, 1, 'yo', 1, 10, 10);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  `siteEPF` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables exportées
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
-- AUTO_INCREMENT pour les tables exportées
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10071;
--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

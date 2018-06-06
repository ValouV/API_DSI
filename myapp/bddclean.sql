-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le :  mer. 06 juin 2018 à 14:32
-- Version du serveur :  5.6.38
-- Version de PHP :  7.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `Inventaire_DSI`
--

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

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `historiquestock`
--
ALTER TABLE `historiquestock`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `historiquestock`
--
ALTER TABLE `historiquestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

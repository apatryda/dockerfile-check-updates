FROM node:12.2.1-alpine as base
FROM node:10.20.1 as base2
FROM node:8.0.1-stretch as base3
FROM mysql:5.0.0 as base4
FROM mysql:5 as base5
FROM eu.gcr.io/lian-empty-project/empty-debian-container as base6
# FROM base as base6

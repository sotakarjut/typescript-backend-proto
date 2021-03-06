import { Request, Response } from "express";
import mongoose from "mongoose";

import { default as Message, MessageModel } from "../models/Message";
import { default as User, UserModel } from "../models/User";

import { DatabaseError } from "../util/error";
import logger from "../util/logger";

import { getLatest, getLatestForList, getMailingLists, getMessagesForUser, postMessageAsUser } from "../services/message";

const request = require("express-validator");
/**
 * @api {post} messages Send new message
 * @apiGroup Messages
 * @apiHeader {String} Authorization Bearer jwt-token.
 * @apiDescription
 * Posts a new message.
 * @apiParam {String} title Title of the message (required)
 * @apiParam {String} messageBody Message body
 * @apiParam {String} recipientId Id of the message's recipient. Can be user or mailinglist (required)
 * @apiParam {String} replyTo Optional parameter Id of the message this is a reply to.
 *
 * @apiError (400) MissingData The request did not contain alla necessary data.
 * @apiError (404) NotFound Either the recipient or the replyTo-message, if provided was not found.
 * @apiError (500) DatabaseError The database search failed.
 * @apiSuccess (200) {Object} message The message which was saved to the database.
 */
export let postNewMessage = (req: Request, res: Response) => {

  req.assert("title", "Title cant be blank").notEmpty();
  req.assert("recipientId", "Title cant be blank").notEmpty();

  if (req.validationErrors()) {
    console.log(req.validationErrors());
    return res.status(400).send("Error: Missing data");
  }
  postMessageAsUser(req.user._id, req.body).then( (message: any) => {
     return res.status(200).send(message);
  }).catch( (err: DatabaseError) => {
    return res.status(err.statusCode).send(err.message);
  });
};

/**
 * @api {get} messages Get all messages
 * @apiGroup Messages
 * @apiHeader {String} Authorization Bearer jwt-token.
 * @apiDescription
 * Returns all messages for the authenticated user.
 *
 * @apiError (500) DatabaseError The database search failed.
 * @apiSuccess (200) {Object[]} messages An array containing all the messages the user has received.
 */
export let getMessages = (req: Request, res: Response) => {

  getMessagesForUser(req.user._id).then( (messages: any) => {
     return res.status(200).send(messages);
  }).catch( (err: DatabaseError) => {
    return res.status(err.statusCode).send(err.message);
  });

};

/**
 * @api {get} messages/latest 10 latest messages
 * @apiGroup Messages
 * @apiDescription
 * Returns the timestamp and recipient of the 10 latest messages
 *
 * @apiError (500) DatabaseError The database search failed.
 * @apiSuccess (200) {Object[]} messages An array containing at max 10 messages with recipient username and profile.name and timestamps.
 */
export let getLatestMessages = (req: Request, res: Response) => {

  getLatest().then( (messages: any) => {
     return res.status(200).send(messages);
  }).catch( (err: DatabaseError) => {
    return res.status(err.statusCode).send(err.message);
  });

};

/**
 * @api {get} messages/latest/role/:name 10 latest messages that the specified role name
 * @apiGroup Messages
 * @apiDescription
 * Returns the timestamp and recipient of the 10 latest messages that were sent to the specified role
 *
 * @apiParam {String} role Name of the role requested.
 * @apiError (400) MissingData The request did not contain alla necessary data.
 * @apiError (500) DatabaseError The database search failed.
 * @apiSuccess (200) {Object[]} messages An array containing at max 10 messages with recipient username and profile.name and timestamps.
 */
export let getLatestMessagesByRole = (req: Request, res: Response) => {
  req.assert("name", "You must specify a name for the role").notEmpty();

  if (req.validationErrors()) {
    return res.status(400).json({errors: req.validationErrors()});
  }
  getLatest(req.params.name).then( (messages: any) => {
     return res.status(200).send(messages);
  }).catch( (err: DatabaseError) => {
    return res.status(err.statusCode).send(err.message);
  });
};

/**
 * @api {get} messages/latest/mailinglist 10 latest messages
 * @apiGroup Messages
 * @apiDescription
 * Returns the timestamp and recipient of the 10 latest messages that were sent to mailing lists
 *
 * @apiError (500) DatabaseError The database search failed.
 * @apiSuccess (200) {Object[]} messages An array containing at max 10 messages with mailing list name and timestamp
 */
export let getLatestListMessages = (req: Request, res: Response) => {

  getLatestForList().then( (messages: any) => {
     return res.status(200).send(messages);
  }).catch( (err: DatabaseError) => {
    return res.status(err.statusCode).send(err.message);
  });

};

/**
 * @api {get} mailinglists Get all messages
 * @apiGroup Messages
 * @apiHeader {String} Authorization Bearer jwt-token.
 * @apiDescription
 * Returns all mailing lists
 *
 * @apiError (500) DatabaseError The database search failed.
 * @apiSuccess (200) {Object[]} mailingLists A map containing all mailinglists.
 */
export let getAllMailingLists = (req: Request, res: Response) => {

  getMailingLists().then( (mailingLists: any) => {
     return res.status(200).send(mailingLists);
  }).catch( (err: DatabaseError) => {
    return res.status(err.statusCode).send(err.message);
  });

};

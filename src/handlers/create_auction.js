import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import customError from 'http-errors';
import middy_middleware from '../middleware/middy_middleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
	const { title } = event.body;

	const auction = {
		id: uuid(),
		title,
		createdAt: new Date().toISOString(),
		status: 'OPEN',
	};

	try {
		await dynamoDB
			.put({
				TableName: process.env.AUCTIONS_TABLE_NAME,
				Item: auction,
			})
			.promise();
	} catch (error) {
		console.log(error);
		throw new customError.InternalServerError(error);
	}

	return {
		statusCode: 201,
		body: JSON.stringify({ auction }),
	};
}

export const handler = middy_middleware(createAuction);

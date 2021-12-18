import AWS from 'aws-sdk';

import customError from 'http-errors';
import middy_middleware from '../middleware/middy_middleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
	let auction;
	const { id } = event.pathParameters;
	try {
		const result = dynamoDB
			.get({
				TableName: process.env.AUCTIONS_TABLE_NAME,
				Key: { id },
			})
			.promise();

		auction = (await result).Item;
	} catch (error) {
		console.error(error);
		throw new customError.InternalServerError(error);
	}

	if (!auction) {
		throw new customError.NotFound(`Auction with id ${id} not found`);
	}
	return {
		statusCode: 200,
		body: JSON.stringify({ auction }),
	};
}

export const handler = middy_middleware(getAuction);

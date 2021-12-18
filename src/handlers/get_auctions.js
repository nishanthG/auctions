import AWS from 'aws-sdk';
import customError from 'http-errors';
import middy_middleware from '../middleware/middy_middleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
	let auctions;

	try {
		const result = dynamoDB
			.scan({
				TableName: process.env.AUCTIONS_TABLE_NAME,
			})
			.promise();

		auctions = (await result).Items;
	} catch (error) {
		console.error(error);
		throw new customError.InternalServerError(error);
	}
	return {
		statusCode: 200,
		body: JSON.stringify({ auctions }),
	};
}

export const handler = middy_middleware(getAuctions);

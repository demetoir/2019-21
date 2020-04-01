import _ from "lodash";
import {Presets, SingleBar} from "cli-progress";
import config from "../dummy/initialConfig.js";
import makeQuestionDummy from "../dummy/questionDummies";

module.exports = {
	up: async queryInterface => {
		const totalSize = config.QUESTION_NUM;
		const chunkSize = 5000;
		const batchSize = Math.floor(totalSize / chunkSize);

		const progressBar = new SingleBar({}, Presets.shades_classic);

		progressBar.start(batchSize, 0);

		const bulk = await makeQuestionDummy(chunkSize);
		const jobs = _.range(batchSize).map(async () => {
			await queryInterface.bulkInsert("Questions", bulk, {raw: true});

			progressBar.increment(1);
		});

		await Promise.all(jobs);
		progressBar.stop();
	},
	down: queryInterface => queryInterface.bulkDelete("Questions", null, {}),
};

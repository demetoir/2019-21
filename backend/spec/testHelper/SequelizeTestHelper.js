import MochaTestHelper from "./MochaTestHelper.js";
import models from "../../DB/models";

export default class SequelizeTestHelper extends MochaTestHelper {
	async setup() {
		this.promise = models.sequelize.sync();

		return this.promise;
	}

	async teardown() {
		return null;
	}
}

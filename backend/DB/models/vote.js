import {Model} from "sequelize";

export default class Vote extends Model {
	static init(sequelize, DataTypes) {
		const model = super.init(
			{
				createdAt: {
					allowNull: false,
					type: DataTypes.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: DataTypes.DATE,
				},
			},
			{sequelize, tableName: "Votes"},
		);

		// Vote table is associate entity table primary key would be (GuestId, CandidateId)
		// in sequelize, default primary key is 'id', so without remove attribute 'id' will
		// occur error 'column 'id' not exist' in 'sqlite' dialect
		// ref https://sequelize.org/master/manual/legacy.html
		// Sequelize will assume your table has a id primary key property by default.
		// And if your model has no primary key at all you can use Model.removeAttribute('id');
		model.removeAttribute("id");

		return model;
	}

	static associate(models) {
		models.Vote.belongsTo(models.Guest);
		models.Vote.belongsTo(models.Candidate);
	}
}

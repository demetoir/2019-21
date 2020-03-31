import React, {useState} from "react";
import {
	DateTimePicker,
	MuiPickersUtilsProvider,
	TimePicker,
} from "@material-ui/pickers";
import {styled} from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import Container from "@material-ui/core/Container";
import moment from "moment";
import {validDate} from "../../libs/eventValidation";
import {SET_ERROR_STATE, SET_PROPERTY} from "./eventModalActions.js";

const marginTopLength = 20;
const defaultInputTime = new Date().setHours(1, 0);
const dateTimePickerFormat = "yyyy년 MM월 dd일 HH시 mm분";
const timePickerFormat = "HH시간 mm분";

const CustomContainer = styled(Container)({
	display: "flex",
	margin: "1rem 0 0 0",
	padding: 0,
});

const CustomDateTimePicker = styled(DateTimePicker)({
	marginTop: marginTopLength,
	width: 250,
});

const CustomTimePicker = styled(TimePicker)({
	marginTop: marginTopLength,
	marginLeft: 30,
	width: 120,
});

function InputStartDate(props) {
	const {startDate, dispatch, errorState} = props;
	const [lastTime, setLastTime] = useState(defaultInputTime);

	const calcEndDate = (lastTime, startTime = startDate) => {
		const hour = moment(lastTime).format("HH");
		const minute = moment(lastTime).format("mm");
		let addedTime = moment(startTime)
			.add(hour, "h")
			.toDate();

		addedTime = moment(addedTime)
			.add(minute, "m")
			.toDate();
		dispatch({
			type: SET_PROPERTY,
			property: "endDate",
			value: moment(addedTime),
		});
		setLastTime(lastTime);
		dispatch({
			type: SET_ERROR_STATE,
			property: "date",
			value: !validDate(startTime, addedTime),
		});
	};

	const setDate = event => {
		dispatch({
			type: SET_PROPERTY,
			property: "startDate",
			value: event,
		});
		calcEndDate(lastTime, event);
	};

	return (
		<CustomContainer>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<CustomDateTimePicker
					label="시작날짜"
					error={errorState.date}
					value={startDate}
					format={dateTimePickerFormat}
					onChange={setDate}
				/>
				<CustomTimePicker
					clearable
					ampm={false}
					label="유효시간"
					minutesStep={5}
					value={lastTime}
					format={timePickerFormat}
					onChange={calcEndDate}
				/>
			</MuiPickersUtilsProvider>
		</CustomContainer>
	);
}

export default InputStartDate;

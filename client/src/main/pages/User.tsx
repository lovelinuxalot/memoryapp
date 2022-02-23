import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/reducers/allReducer";

import axios from "axios";
import { IRecordWithCreator } from "../redux/actionSchemas/recordSchema";

import NavbarV1 from "../components/headers/NavbarV1";
import EditProfileV1 from "../components/modal/EditProfileModalV1";
import ViewMemoryV2 from "../components/modal/ViewMemoryV2";

import editProfileV1 from "../assets/images/buttons/editProfileV1.png";
import filterBtnV1 from "../assets/images/buttons/filterBtnV1.png";
import addBtnV1 from "../assets/images/buttons/addBtnV1.png";
import emptyV1 from "../assets/images/icons/emptyV1.png";

const User: React.FC = () => {
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user);
	const [recordState, setRecordState] = useState<{ records: IRecordWithCreator[] }>({
		records: [],
	});
	const [selectRecord, setSelectRecord] = useState<IRecordWithCreator>();
	const [triggerEditProfile, setTriggerEditProfile] = useState(false);
	const [triggerViewMemory, setTriggerViewMemory] = useState(false);

	useEffect(() => {
		// retrive user record with creator details
		if (userState._id)
			axios
				.get(`/api/records/record-creator/user/${userState._id}`)
				.then((res: any) => setRecordState({ records: res.data }))
				.catch(err => console.log("err", err));
	}, [userState]);

	// fill the gap of 4 picture per column design to push the picture at the left side
	const emptyImages = () => {
		if (recordState.records?.length) {
			const numberOfEmptySlots = recordState.records?.length % 4;
			const emptySlots = [];
			for (let a = 0; a < numberOfEmptySlots; a++) emptySlots.push(a);
			return emptySlots.map((item: any, index: number) => (
				<img src={emptyV1} alt="image" key={index} className="memory-display-container" />
			));
		}
	};

	const DisplayUserAllMemories = () => (
		<div className="user-memory-parent">
			<div className="user-memory-container">
				{recordState.records?.map((record: IRecordWithCreator, index: number) => (
					<img
						className="cursor-point memory-display-container"
						src={record.images[0].link}
						key={index}
						alt="empty image"
						onClick={() => selectMemory(record)}
					/>
				))}
				{emptyImages()}
			</div>
		</div>
	);

	const SideMenu = () => (
		<div className="side-menu-parent">
			<div className="side-menu-container">
				<img src={filterBtnV1} alt="filter" className="cursor-point filter-btn" />
				<img src={addBtnV1} alt="add" className="cursor-point add-btn" onClick={() => navigate("/upload-memory")} />
			</div>
		</div>
	);

	const getAge = () => {
		if (!userState.birthday) return "";

		const today = new Date();
		const birthDate = new Date(userState.birthday);

		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();

		// checks if their birthday is not passed
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

		return age;
	};

	const selectMemory = (record: IRecordWithCreator) => {
		setTriggerViewMemory(!triggerViewMemory);
		setSelectRecord(record);
	};

	return (
		<div style={{ backgroundColor: "FFFFFF", height: "500vh" }}>
			<NavbarV1 />
			<div className="user-details-parent-container">
				<div className="user-details-top-container">
					<div className="user-details-top-left-container">
						<img
							src={editProfileV1}
							alt="edit button"
							className="cursor-point"
							onClick={() => setTriggerEditProfile(!triggerEditProfile)}
						/>
						<div className="name-age-loc-container">
							<h4>regular contributor</h4>
							<h1>{`${userState.given_name} ${userState.surname}`}</h1>
							{userState.location ? <h4>{`${getAge()} | ${userState.location}`}</h4> : <React.Fragment></React.Fragment>}
						</div>
					</div>
					<img src={userState.user_profile} alt="user profile" className="img-container" />
				</div>
				<div className="user-details-btm-container">
					<div className="bio-parent-container">
						<div className="bio-output-container">
							<span>{userState.bio}</span>
						</div>
					</div>
				</div>
			</div>

			<EditProfileV1 modalTigger={triggerEditProfile} />
			<ViewMemoryV2 modalTigger={triggerViewMemory} record={selectRecord} />
			<SideMenu />
			<DisplayUserAllMemories />
		</div>
	);
};

export default User;

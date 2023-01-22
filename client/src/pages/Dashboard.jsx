import React, { useEffect, useState } from 'react'
// import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";
const Dashboard = () => {
	const [inpTitle, setinpTitle] = useState('')
	const [inpNote, setinpNote] = useState('')
	const [data, setdata] = useState('')
	const [tobemapped, settobemapped] = useState(false)
	const [User, setUser] = useState('')
	const navigate = useNavigate();
	const [delID, setdelID] = useState('')
	async function getNote() {
		const req = await fetch(`http://localhost:1337/api/quote`, {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setdata(data.note_data)
			setUser(data.user_det)
			// console.log('user_det', data.user_det)
			// console.log('note_data :>> ', data.note_data);

			// console.log(data.note_data.length)
			if (data.note_data.length > '1') {
				settobemapped(true)
			}
			else {
				settobemapped(false)
			}
			console.log(tobemapped)

		} else {
			alert(data.error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt_decode(token)
			console.log('user', user)
			if (!user) {
				localStorage.removeItem('token')
				navigate('/Login')
			} else {
				getNote()
			}
		}

	}, [tobemapped])

	async function newNOte(event) {
		event.preventDefault()
		const req = await fetch(`http://localhost:1337/api/quote`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				title: inpTitle,
				note: inpNote
			}),
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setinpTitle('')
			getNote()
		} else {
			alert(data.error)
		}
	}
	async function delNote(event) {
		const req = await fetch(`http://localhost:1337/api/quote`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				id: delID
			}),
		})
		getNote()
		const data = await req.json()
	}
	return (
		<div>
			<div>Your Title: {tobemapped ? data.map((e) => {
				return (
					<div key={e._id}>
						<button onClick={() => { [setdelID(e._id), delNote()] }}>DELETE</button>
						<li>{e.title}</li>

						<li>{e.time}</li>
					</div>
				)
			}) : data.title}</div>
			<p>Your Note: </p>
			<form onSubmit={newNOte}>
				<input
					type="text"
					placeholder="Title"
					value={inpTitle}
					onChange={(e) => setinpTitle(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Note"
					value={inpNote}
					onChange={(e) => setinpNote(e.target.value)}
				/>
				<input type="submit" value="Create note" />
			</form>
		</div>
	)
}

export default Dashboard

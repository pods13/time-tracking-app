class TimersDashboard extends React.Component {

	state = {
		timers: [
				{
				  "title": "Mow the lawn",
				  "project": "House Chores",
				  "elapsed": 5456099,
				  "id": "0a4a79cb-b06d-4cb1-883d-549a1e3b66d7"
				},
				{
				  "title": "Clear paper jam",
				  "project": "Office Chores",
				  "elapsed": 1273998,
				  "id": "a73c1d19-f32d-4aff-b470-cea4e792406a"
				}
		]
	}

	render() {
		return (
			<div className='ui three column centered grid'>
				<div className='column'>
					<EditableTimerList timers={this.state.timers}/>
					<ToggleableTimerForm onFormSubmit={this.handleCreateFormSubmit}/>
				</div>
			</div>
		);
	}

	handleCreateFormSubmit = (timerData) => {
		this.createNewTimer(timerData);
	}

	createNewTimer = (timerData) => {
		const newTimer = {
			id: uuid.v4(),
			title: timerData.title || 'Timer',
			project: timerData.project || 'Project',
			elapsed: 0
		};

		this.setState({ 
			timers: this.state.timers.concat(newTimer)
		});
	}
}

class EditableTimerList extends React.Component {

	render() {
		const editableTimers = this.props.timers.map(timer => {
			return <EditableTimer
					key={timer.id}
					id={timer.id}
					title={timer.title}
					project={timer.project}
					elapsed={timer.elapsed}
					runningSince={null}
				/>
		});
		return (
			<div id='timers'>
				{editableTimers}
			</div>
		);
	}
}

class EditableTimer extends React.Component {

	state = {
		editFormOpen: false
	}

	render() {
		if(this.state.editFormOpen) {
			return (
				<TimerForm
					id={this.props.id}
					title={this.props.title}
					project={this.props.project}
				/>
			);
		} else {
			return (
				<Timer 
					id={this.props.id}
					title={this.props.title}
					project={this.props.project}
					elapsed={this.props.elapsed}
				/>
			);
		}
	}
}

class TimerForm extends React.Component {

	state = {
		title: this.props.title || '',
		project: this.props.project || ''
	}

	render() {
		const submitText = this.props.id ? 'Update' : 'Create';
		return (
			<div className='ui centered card'>
				<div className='content'>
					<div className='ui form'>
						<div className='field'>
							<label>Title</label>
							<input type='text' value={this.state.title} onChange={this.handleTitleChange}/>
						</div>
						<div className='field'>
							<label>Project</label>
							<input type='text' value={this.state.project} onChange={this.handleProjectChange}/>
						</div>
						<div className='ui two bottom attached buttons'>
							<button className='ui basic blue button' onClick={this.handleSubmit}>
								{submitText}
							</button>
							<button className='ui basic red button' onClick={this.props.onFormClose}>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	handleTitleChange = (e) => {
		this.setState({ title: e.target.value });
	}

	handleProjectChange = (e) => {
		this.setState({ project: e.target.value });
	}

	handleSubmit = () => {
		this.props.onFormSubmit({
			title: this.state.title,
			project: this.state.project
		});
	}
}

class Timer extends React.Component {

	render() {
		return (
			<div className='ui centered card'>
				<div className='content'>
					<div className='header'>
						{this.props.title}
					</div>
					<div className='meta'>
						{this.props.project}
					</div>
					<div className='center aligned description'>
						<h2>
							{this.props.elapsed}
						</h2>
					</div>
					<div className='extra content'>
						<span className='right floated edit icon'>
							<i className='edit icon' />
						</span>
						<span className='right floated trash icon'>
							<i className='trash icon' />
						</span>
					</div>
				</div>
				<div className='ui bottom attached blue basic button'>
					Start
				</div>
			</div>
		);
	}
}

class ToggleableTimerForm extends React.Component {

	state = {
		isOpen: false
	}

	render() {
		if(this.state.isOpen) {
			return (
				<TimerForm 
					onFormSubmit={this.handleFormSubmit}
					onFormClose={this.handleFormClose}
				/>
			);
		} else {
			return (
				<div className='ui basic content center aligned segment'>
					<button className='ui basic button icon' onClick={this.handleFormOpen}>
						<i className='plus icon'/>
					</button>
				</div>
			);
		}
	}

	handleFormOpen = () => {
		this.setState({ isOpen: true });
	}

	handleFormSubmit = (timerData) => {
		this.props.onFormSubmit(timerData);
	}

	handleFormClose = () => {
		this.setState({ isOpen: false });
	}
}

ReactDOM.render(
	<TimersDashboard/>,
	document.getElementById('content')
);
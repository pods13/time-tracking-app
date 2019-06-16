class TimersDashboard extends React.Component {

	state = {
		timers: []
	}

	componentDidMount() {
		this.fetchTimers();
		setInterval(this.fetchTimers, 5000);
	}

	fetchTimers = () => {
		client.getTimers((timers) => this.setState({timers}));
	}

	render() {
		return (
			<div className='ui three column centered grid'>
				<div className='column'>
					<EditableTimerList timers={this.state.timers} 
						onFormSubmit={this.handleEditFormSubmit}
						onTrashClick={this.handleTrashClick}
						onStartClick={this.handleStartClick}
						onStopClick={this.handleStopClick}
					/>
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

		client.createTimer(newTimer);
	}

	handleEditFormSubmit = (timerData) => {
		const timers = this.state.timers.map((timer) => {
			if(timer.id === timerData.id) {
				return Object.assign({}, timer, timerData);
			}

			return timer;
		});

		this.setState({ timers });

		client.updateTimer(timerData);
	}

	handleTrashClick = (timerId) => {
		const timers = this.state.timers.filter(timer => timer.id !== timerId);

		this.setState({ timers });

		client.deleteTimer({id: timerId});
	}

	handleStartClick = (timerId) => {
		const now = Date.now();
		const timers = this.state.timers.map(timer => {
			if(timer.id === timerId) {
				return Object.assign({}, timer, {runningSince: now});
			}

			return timer;
		});

		this.setState({ timers });

		client.startTimer({id: timerId, start: now});
	}

	handleStopClick = (timerId) => {
		const now = Date.now();
		const timers = this.state.timers.map(timer => {
			if(timer.id === timerId) {
				const elapsed = timer.elapsed + (now - timer.runningSince);
				return Object.assign({}, timer, {
					elapsed,
					runningSince: null
				});
			}

			return timer;
		});

		this.setState({ timers });

		client.stopTimer({id: timerId, stop: now});
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
					runningSince={timer.runningSince}
					onFormSubmit={this.props.onFormSubmit}
					onTrashClick={this.props.onTrashClick}
					onStartClick={this.props.onStartClick}
					onStopClick={this.props.onStopClick}
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
					onFormClose={this.handleFormClose}
					onFormSubmit={this.handleFormSubmit}
				/>
			);
		} else {
			return (
				<Timer 
					id={this.props.id}
					title={this.props.title}
					project={this.props.project}
					elapsed={this.props.elapsed}
					runningSince={this.props.runningSince}
					onEditClick={this.handleEditClick}
					onTrashClick={this.props.onTrashClick}
					onStartClick={this.props.onStartClick}
					onStopClick={this.props.onStopClick}
				/>
			);
		}
	}

	handleEditClick = () => {
		this.setState({ editFormOpen: true });
	}

	handleFormSubmit = (timerData) => {
		this.props.onFormSubmit(timerData);
		this.closeForm();
	}

	handleFormClose = () => {
		this.closeForm();
	}

	closeForm = () => {
		this.setState({ editFormOpen: false });		
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
			id: this.props.id,
			title: this.state.title,
			project: this.state.project
		});
	}
}

class Timer extends React.Component {

	componentDidMount() {
		this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
	}

	componentWillUnmount() {
		clearInterval(this.forceUpdateInterval);
	}

	render() {
		const elapsedString = this.renderElapsedString(this.props.elapsed, this.props.runningSince);
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
							{elapsedString}
						</h2>
					</div>
					<div className='extra content'>
						<span className='right floated edit icon' onClick={this.props.onEditClick}>
							<i className='edit icon' />
						</span>
						<span className='right floated trash icon' onClick={this.handleTrashClick}>
							<i className='trash icon' />
						</span>
					</div>
				</div>
				<TimerActionButton 
					timerIsRunning={!!this.props.runningSince}
					onStartClick={this.handleStartClick}
					onStopClick={this.handleStopClick}
				/>
			</div>
		);
	}

	handleTrashClick = () => {
		this.props.onTrashClick(this.props.id);
	}

	handleStartClick = () => {
		this.props.onStartClick(this.props.id);
	}

	handleStopClick = () => {
		this.props.onStopClick(this.props.id);
	}

	renderElapsedString = (elapsed, runningSince) => {
		let totalElapsed = elapsed;
		if (runningSince) {
			totalElapsed += Date.now() - runningSince;
		}
		return this.convertMillisecondsToHumanFormat(totalElapsed);
	}

	convertMillisecondsToHumanFormat = (ms) => {
		const seconds = Math.floor((ms / 1000) % 60);
		const minutes = Math.floor((ms / 1000 / 60) % 60);
		const hours = Math.floor(ms / 1000 / 60 / 60);

		const humanized = [
			this.pad(hours.toString(), 2),
			this.pad(minutes.toString(), 2),
			this.pad(seconds.toString(), 2),
		].join(':');

		return humanized;
	}

	pad = (numberString, size) => {
		let padded = numberString;
		while (padded.length < size) {
			padded = `0${padded}`;
		}
		return padded;
	}
}

class TimerActionButton extends React.Component {

	render() {
		if(this.props.timerIsRunning) {
			return (
				<div className='ui bottom attached red basic button' onClick={this.props.onStopClick}>
					Stop
				</div>
			);
		} else {
			return (
				<div className='ui bottom attached green basic button' onClick={this.props.onStartClick}>
					Start
				</div>
			);

		}
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
		this.closeForm();
	}

	handleFormClose = () => {
		this.closeForm();
	}

	closeForm = () => {
		this.setState({ isOpen: false });		
	}
}

ReactDOM.render(
	<TimersDashboard/>,
	document.getElementById('content')
);
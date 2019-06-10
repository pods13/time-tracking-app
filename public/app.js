class TimersDashboard extends React.Component {
	render() {
		return (
			<div className='ui three column centered grid'>
				<div className='column'>
					<EditableTimerList/>
					<ToggleableTimerForm isOpen={true} />
				</div>
			</div>
		);
	}
}

class EditableTimerList extends React.Component {

	render() {
		return (
			<div id='timers'>
				<EditableTimer
					title='Learn React'
					project='Web Dom'
					elapsed='8986300'
					runningSince={null}
					editFormOpen={false}
				/>
				<EditableTimer
					title='Learn React 2'
					project='Web Dom'
					elapsed='8986300'
					runningSince={null}
					editFormOpen={true}
				/>
			</div>
		);
	}
}

class EditableTimer extends React.Component {

	render() {
		if(this.props.editFormOpen) {
			return (
				<TimerForm 
					title={this.props.title}
					project={this.props.project}
				/>
			);
		} else {
			return (
				<Timer 
					title={this.props.title}
					project={this.props.project}
					elapsed={this.props.elapsed}
				/>
			);
		}
	}
}

class TimerForm extends React.Component {

	render() {
		return (
			<div>{this.props.title}</div>
		);
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

	render() {
		if(this.props.isOpen) {
			return (
				<TimerForm />
			);
		} else {
			return (
				<div className='ui basic content center aligned segment'>
					<button className='ui basic button icon'>
						<i className='plus icon'/>
					</button>
				</div>
			);
		}
	}
}

ReactDOM.render(
	<TimersDashboard/>,
	document.getElementById('content')
);
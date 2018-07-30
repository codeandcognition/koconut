import React, {Component} from 'react';
import Graph from 'react-graph-vis';
import ConceptInventory from './ConceptMap';
import CardContent from '@material-ui/core/CardContent';

class ConceptNetwork extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inventory: this.props.inventory
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({inventory: nextProps.inventory});
	}

	render() {
		// make a copy of the concept inventory
		let conceptGraph = Object.assign({}, this.state.inventory); // Object.assign({}, ConceptInventory);

		// build the graph to visualize concept network
		let nodes = [];
		let edges = [];
		Object.keys(conceptGraph).forEach(key => {
			let concept = conceptGraph[key];
			let node = {
				id: key,
				label: concept.explanations.name
			};
			nodes.push(node);
			if (concept.dependencies.length > 0) {
				concept.dependencies.forEach(dependency => {
					let edge = {
						from: key,
						to: dependency
					};
					edges.push(edge);
				});
			}
		});
		let graph = {
			nodes: nodes,
			edges: edges
		}

		// graph options
		let options = {
			height: '700px',
			width: '700px',
			layout: {
				hierarchical: false,
				improvedLayout:true,
			},
			edges: {
				color: "#000000"
			}
		};

		// graph events
		let events = {
			select: (event) => {
				let {nodes, edges} = event;
			}
		};

		return(
				<div>
					<CardContent>
						<p>Concept Map</p>
						<Graph graph={graph} options={options} events={events}/>
					</CardContent>
				</div>
		)
	}
}

export default ConceptNetwork;
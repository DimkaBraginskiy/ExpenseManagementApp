import "./Card.css"
import {Component} from "react";

export class Card extends Component<{ description: any, amount: any }> {
    render() {
        let {
            description,
            amount
        } = this.props;
        return <div className="card-container">
            <h3 className="card-description">{description}</h3>
            <h4 className="card-amount">{amount}</h4>
        </div>;
    }
}
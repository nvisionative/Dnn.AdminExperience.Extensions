import React, {Component, PropTypes } from "react";
import Label from "dnn-label";
import InputGroup from "dnn-input-group";
//import SingleLineInput from "dnn-single-line-input";
import SingleLineInputWithError from "dnn-single-line-input-with-error";
import GlobalIcon from "./GlobalIcon";

export default class EditBlock extends Component {
    
    render() {
        const {props} = this;

        return <InputGroup>
            <Label className="title"
                tooltipMessage={props.tooltip}
                label={props.label} style={{width: "auto"}} />
            {props.isGlobal && <GlobalIcon /> }
            <SingleLineInputWithError 
                value={props.value} 
                type={props.type} 
                onChange={props.onChange}
                error={!!props.error} 
                errorMessage={props.error} />
        </InputGroup>;
    }
}

EditBlock.propTypes = {
    label: PropTypes.string,
    tooltip: PropTypes.string,
    value: PropTypes.string,
    isGlobal: PropTypes.bool.isRequired,
    type: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string
};

EditBlock.defaultProps = {
    isGlobal: false
};
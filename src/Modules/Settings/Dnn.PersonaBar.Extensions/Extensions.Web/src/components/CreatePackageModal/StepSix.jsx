import React, { PropTypes } from "react";
import GridCell from "dnn-grid-cell";
import Button from "dnn-button";
import { Scrollbars } from "react-custom-scrollbars";
import Localization from "localization";

const packageCreationStyle = {
    border: "1px solid #c8c8c8",
    marginBottom: 25,
    height: 250,
    width: "100%"
};

const StepSix = ({onClose, logs}) => (
    <GridCell className="review-logs-step">
        <h6 className="box-title">{Localization.get("CreatePackage_ChooseFiles.Label")}</h6>
        <p className="box-subtitle">{Localization.get("CreatePackage_ChooseFiles.HelpText")}</p>
        <GridCell className="package-logs-container no-padding">

            <Scrollbars style={packageCreationStyle}>
                <div className="package-creation-report">
                    {logs.map((log) => {
                        return <p>{log}</p>;
                    })}
                </div>
            </Scrollbars>
        </GridCell>
        <GridCell className="modal-footer">
            <Button type="primary" onClick={onClose}>{Localization.get("Done.Button")}</Button>
        </GridCell>
    </GridCell>
);

StepSix.propTypes = {
    onClose: PropTypes.func,
    logs: PropTypes.array
};
export default StepSix;

import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import {
    languages as LanguagesActions
} from "../../actions";
import InputGroup from "dnn-input-group";
import Languages from "./languages";
import Grid from "dnn-grid-system";
import Dropdown from "dnn-dropdown";
import RadioButtons from "dnn-radio-buttons";
import Switch from "dnn-switch";
import Tooltip from "dnn-tooltip";
import Label from "dnn-label";
import Button from "dnn-button";
import "./style.less";
import util from "../../utils";
import resx from "../../resources";
import styles from "./style.less";

let isHost = false;
let defaultAllowContentLocalization = null;

class LanguageSettingsPanelBody extends Component {
    constructor() {
        super();
        this.state = {
            languageSettings: undefined
        };
        isHost = util.settings.isHost;
    }

    loadData() {
        const {props} = this;
        if (props.languageSettings) {
            let portalIdChanged = false;
            let cultureCodeChanged = false;

            if (props.portalId === undefined || props.languageSettings.PortalId === props.portalId) {
                portalIdChanged = false;
            }
            else {
                portalIdChanged = true;
            }

            if (props.cultureCode === undefined || props.languageSettings.CultureCode === props.cultureCode) {
                cultureCodeChanged = false;
            }
            else {
                cultureCodeChanged = true;
            }

            if (portalIdChanged || cultureCodeChanged) {
                return true;
            }
            else return false;
        }
        else {
            return true;
        }
    }

    componentWillMount() {
        const {props} = this;
        if (!this.loadData()) {
            this.setState({
                languageSettings: props.languageSettings
            });
            return;
        }
        props.dispatch(LanguagesActions.getLanguageSettings(props.portalId, props.cultureCode, (data) => {
            this.setState({
                languageSettings: Object.assign({}, data.Settings)
            });
        }));
    }

    componentWillReceiveProps(props) {
        this.setState({
            languageSettings: Object.assign({}, props.languageSettings)
        });
        if (defaultAllowContentLocalization === null) {
            defaultAllowContentLocalization = props.languageSettings.AllowContentLocalization;
        }
    }

    onSettingChange(key, event) {
        let {state, props} = this;
        let languageSettings = Object.assign({}, state.languageSettings);

        if (key === "LanguageDisplayMode") {
            languageSettings[key] = event;
        }
        else if (key === "SiteDefaultLanguage") {
            languageSettings[key] = event.value;
        }
        else {
            languageSettings[key] = typeof (event) === "object" ? event.target.value : event;
        }

        this.setState({
            languageSettings: languageSettings
        });

        props.dispatch(LanguagesActions.languageSettingsClientModified(languageSettings));
    }

    onUpdate(event) {
        event.preventDefault();
        const {props, state} = this;

        props.dispatch(LanguagesActions.updateLanguageSettings(state.languageSettings, () => {
            util.utilities.notify(resx.get("SettingsUpdateSuccess"));
            defaultAllowContentLocalization = state.languageSettings.AllowContentLocalization;
            this.setState({

            });
        }, () => {
            util.utilities.notifyError(resx.get("SettingsError"));
        }));
    }

    onCancel() {
        const {props} = this;
        util.utilities.confirm(resx.get("SettingsRestoreWarning"), resx.get("Yes"), resx.get("No"), () => {
            props.dispatch(LanguagesActions.getLanguageSettings(props.portalId, props.cultureCode, (data) => {
                this.setState({
                    languageSettings: Object.assign({}, data.Settings)
                });
            }));
        });
    }

    getLanguageOptions() {
        const {props, state} = this;
        let options = [];
        if (props.languages !== undefined) {
            options = props.languages.map((item) => {
                if (state.languageSettings.LanguageDisplayMode === "NATIVE") {
                    return {
                        label: <div style={{ float: "left", display: "flex" }}>
                            <div className="language-flag">
                                <img src={item.Icon} />
                            </div>
                            <div className="language-name">{item.NativeName}</div>
                        </div>, value: item.Name
                    };
                }
                else {
                    return {
                        label: <div style={{ float: "left", display: "flex" }}>
                            <div className="language-flag">
                                <img src={item.Icon} />
                            </div>
                            <div className="language-name">{item.EnglishName}</div>
                        </div>, value: item.Name
                    };
                }
            });
        }
        return options;
    }

    getLanguageDisplayModes() {
        const {props} = this;
        let options = [];
        if (props.languageDisplayModes !== undefined) {
            options = props.languageDisplayModes.map((item) => {
                return { label: item.Key, value: item.Value };
            });
        }
        return options;
    }

    enableLocalizedContent() {
        const {props} = this;
        if (props.languageSettingsClientModified) {
            util.utilities.notifyError(resx.get("SaveOrCancelWarning"));
        }
        else {
            props.openLocalizedContent();
        }
    }

    disableLocalizedContent() {
        const {props} = this;
        if (props.languageSettingsClientModified) {
            util.utilities.notifyError(resx.get("SaveOrCancelWarning"));
        }
        else {
            props.dispatch(LanguagesActions.disableLocalizedContent(props.portalId, () => {
                props.dispatch(LanguagesActions.getLanguageSettings(props.portalId, props.cultureCode));
            }));
        }
    }

    disableLocalizedContentButton() {
        const {state} = this;

        if (defaultAllowContentLocalization !== state.languageSettings.AllowContentLocalization) {
            return true;
        }
        else {
            return false;
        }
    }

    getDefaultLanguageDisplay() {
        const {state} = this;
        return (
            <div className="default-language">
                <div className="language-container">
                    <div style={{ float: "left", display: "flex" }}>
                        <div className="language-flag">
                            <img src={state.languageSettings.SystemDefaultLanguageIcon} />
                        </div>
                        <div className="language-name">{state.languageSettings.SystemDefaultLanguage}</div>
                    </div>
                </div>
            </div>
        );
    }

    /* eslint-disable react/no-danger */
    render() {
        const {props, state} = this;
        if (state.languageSettings) {
            const columnOne = <div className="left-column">
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("systemDefaultLabel.Help")}
                        label={resx.get("systemDefaultLabel")}
                        />
                    {this.getDefaultLanguageDisplay()}
                </InputGroup>
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("siteDefaultLabel.Help")}
                        label={resx.get("siteDefaultLabel")}
                        />
                    <Dropdown
                        options={this.getLanguageOptions()}
                        value={state.languageSettings.SiteDefaultLanguage}
                        onSelect={this.onSettingChange.bind(this, "SiteDefaultLanguage")}
                        enabled={!state.languageSettings.ContentLocalizationEnabled}
                        />
                    <RadioButtons
                        onChange={this.onSettingChange.bind(this, "LanguageDisplayMode")}
                        options={this.getLanguageDisplayModes()}
                        buttonGroup="languageDisplayMode"
                        value={state.languageSettings.LanguageDisplayMode}
                        />
                </InputGroup>
            </div>;
            const columnTwo = <div className="right-column">
                <InputGroup>
                    <div className="languageSettings-row_switch">
                        <Label
                            labelType="inline"
                            tooltipMessage={resx.get("plUrl.Help")}
                            label={resx.get("plUrl")}
                            />
                        <Switch
                            labelHidden={true}
                            value={state.languageSettings.EnableUrlLanguage}
                            onChange={this.onSettingChange.bind(this, "EnableUrlLanguage")}
                            readOnly={state.languageSettings.ContentLocalizationEnabled}
                            />
                    </div>
                </InputGroup>
                <InputGroup>
                    <div className="languageSettings-row_switch">
                        <Label
                            labelType="inline"
                            tooltipMessage={resx.get("detectBrowserLable.Help")}
                            label={resx.get("detectBrowserLable")}
                            />
                        <Switch
                            labelHidden={true}
                            value={state.languageSettings.EnableBrowserLanguage}
                            onChange={this.onSettingChange.bind(this, "EnableBrowserLanguage")}
                            />
                    </div>
                </InputGroup>
                <InputGroup>
                    <div className="languageSettings-row_switch">
                        <Label
                            labelType="inline"
                            tooltipMessage={resx.get("allowUserCulture.Help")}
                            label={resx.get("allowUserCulture")}
                            />
                        <Switch
                            labelHidden={true}
                            value={state.languageSettings.AllowUserUICulture}
                            onChange={this.onSettingChange.bind(this, "AllowUserUICulture")}
                            />
                    </div>
                </InputGroup>
                {isHost &&
                    <InputGroup>
                        <div className="languageSettings-row_switch">
                            <Label
                                labelType="inline"
                                tooltipMessage={resx.get("plEnableContentLocalization.Help")}
                                label={resx.get("plEnableContentLocalization")}
                                extra={
                                    <Tooltip
                                        messages={[resx.get("GlobalSetting")]}
                                        type="global"
                                        style={{ float: "left", position: "static" }}
                                        />}
                                />
                            <Switch
                                labelHidden={true}
                                value={state.languageSettings.AllowContentLocalization}
                                onChange={this.onSettingChange.bind(this, "AllowContentLocalization")}
                                />
                        </div>
                    </InputGroup>
                }
                <div className={"collapsible-button" + (defaultAllowContentLocalization || state.languageSettings.ContentLocalizationEnabled ? " open" : "")}>
                    {!state.languageSettings.ContentLocalizationEnabled && <Button
                        type="secondary"
                        onClick={this.enableLocalizedContent.bind(this)}
                        disabled={this.disableLocalizedContentButton()}>
                        {resx.get("EnableLocalizedContent")}
                    </Button>}
                    {state.languageSettings.ContentLocalizationEnabled && <Button
                        type="secondary"
                        onClick={this.disableLocalizedContent.bind(this)}
                        disabled={this.disableLocalizedContentButton()}>
                        {resx.get("DisableLocalizedContent")}
                    </Button>}
                </div>
            </div>;

            return (
                <div className={styles.languageSettings}>
                    <Languages
                        portalId={this.props.portalId}
                        languageDisplayMode={state.languageSettings.LanguageDisplayMode}
                        contentLocalizationEnabled={state.languageSettings.ContentLocalizationEnabled}
                        />
                    <div className="sectionTitle">{resx.get("LanguageSettings")}</div>
                    <Grid children={[columnOne, columnTwo]} numberOfColumns={2} />
                    <div className={isHost ? "buttons-box-alter" : "buttons-box"}>
                        <Button
                            disabled={!this.props.languageSettingsClientModified}
                            type="secondary"
                            onClick={this.onCancel.bind(this)}>
                            {resx.get("Cancel")}
                        </Button>
                        {isHost &&
                            <Button
                                type="secondary"
                                onClick={props.openLanguageVerifier}>
                                {resx.get("VerifyLanguageResources")}
                            </Button>
                        }
                        {isHost &&
                            <Button
                                type="secondary"
                                onClick={props.openLanguagePack}>
                                {resx.get("CreateLanguagePack")}
                            </Button>
                        }
                        <Button
                            disabled={!this.props.languageSettingsClientModified}
                            type="primary"
                            onClick={this.onUpdate.bind(this)}>
                            {resx.get("Save")}
                        </Button>
                    </div>
                </div>
            );
        }
        else return <div />;
    }
}

LanguageSettingsPanelBody.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    languageSettings: PropTypes.object,
    languages: PropTypes.array,
    languageDisplayModes: PropTypes.array,
    languageSettingsClientModified: PropTypes.bool,
    portalId: PropTypes.number,
    cultureCode: PropTypes.string,
    openLanguageVerifier: PropTypes.func,
    openLanguagePack: PropTypes.func,
    openLocalizedContent: PropTypes.func
};

function mapStateToProps(state) {
    return {
        tabIndex: state.pagination.tabIndex,
        languageSettings: state.languages.languageSettings,
        languages: state.languages.languages,
        languageDisplayModes: state.languages.languageDisplayModes,
        languageSettingsClientModified: state.languages.languageSettingsClientModified
    };
}

export default connect(mapStateToProps)(LanguageSettingsPanelBody);
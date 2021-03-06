import React from 'react'
import { connect } from 'react-redux'
import { i18n } from '../../../config'
import SectionElement from '../SectionElement'
import { SectionViews, SectionView } from '../SectionView'
import AuthenticatedView from '../../../views/AuthenticatedView'
import { Field } from '../../Form'
import Status from './Status'
import Multiple from './Multiple'
import Passports from './Multiple/Passports'

class Citizenship extends SectionElement {
  render () {
    return (
      <div>
        <SectionViews current={this.props.subsection} dispatch={this.props.dispatch}>
          <SectionView name="intro"
                       back="history/review"
                       backLabel={i18n.t('history.destination.review')}
                       next="citizenship/status"
                       nextLabel={i18n.t('citizenship.destination.status')}>
            <Field title={i18n.t('citizenship.intro.title')}
                   titleSize="h2"
                   className="no-margin-bottom">
              {i18n.m('citizenship.intro.body')}
            </Field>
          </SectionView>

          <SectionView name="review"
                       title={i18n.t('review.title')}
                       para={i18n.m('review.para')}
                       showTop={true}
                       back="citizenship/passports"
                       backLabel={i18n.t('citizenship.destination.passports')}
                       next="military/intro"
                       nextLabel={i18n.t('military.destination.intro')}>
            <Status name="status"
                    {...this.props.Status}
                    defaultState={false}
                    dispatch={this.props.dispatch}
                    onUpdate={this.handleUpdate.bind(this, 'Status')}
                    onError={this.handleError}
                    required={true}
                    scrollIntoView={false}
                    />

            <hr/>
            <Multiple name="multiple"
                      {...this.props.Multiple}
                      defaultState={false}
                      dispatch={this.props.dispatch}
                      onUpdate={this.handleUpdate.bind(this, 'Multiple')}
                      onError={this.handleError}
                      required={true}
                      scrollIntoView={false}
                      />

            <hr/>
            <Passports name="passports"
                      {...this.props.Passports}
                      defaultState={false}
                      dispatch={this.props.dispatch}
                      onUpdate={this.handleUpdate.bind(this, 'Passports')}
                      onError={this.handleError}
                      required={true}
                      scrollIntoView={false}
                      />
          </SectionView>

          <SectionView name="status"
                       back="citizenship/intro"
                       backLabel={i18n.t('citizenship.destination.intro')}
                       next="citizenship/multiple"
                       nextLabel={i18n.t('citizenship.destination.multiple')}>
            <Status name="status"
                    {...this.props.Status}
                    dispatch={this.props.dispatch}
                    onUpdate={this.handleUpdate.bind(this, 'Status')}
                    onError={this.handleError}
                    />
          </SectionView>

          <SectionView name="multiple"
                       back="citizenship/status"
                       backLabel={i18n.t('citizenship.destination.status')}
                       next="citizenship/passports"
                       nextLabel={i18n.t('citizenship.destination.passports')}>
            <Multiple name="multiple"
                      {...this.props.Multiple}
                      dispatch={this.props.dispatch}
                      onUpdate={this.handleUpdate.bind(this, 'Multiple')}
                      onError={this.handleError}
                      scrollToBottom={this.props.scrollToBottom}
                      />
          </SectionView>
          <SectionView name="passports"
                       back="citizenship/multiple"
                       backLabel={i18n.t('citizenship.destination.multiple')}
                       next="citizenship/review"
                       nextLabel={i18n.t('citizenship.destination.review')}>
            <Passports name="passports"
                      {...this.props.Passports}
                      dispatch={this.props.dispatch}
                      onUpdate={this.handleUpdate.bind(this, 'Passports')}
                      onError={this.handleError}
                      scrollToBottom={this.props.scrollToBottom}
                      />
          </SectionView>
        </SectionViews>
      </div>
    )
  }
}

function mapStateToProps (state) {
  let app = state.application || {}
  let citizenship = app.Citizenship || {}
  let errors = app.Errors || {}
  let completed = app.Completed || {}
  return {
    Application: app,
    Citizenship: citizenship,
    Status: citizenship.Status || {},
    Multiple: citizenship.Multiple || {},
    Passports: citizenship.Passports || {},
    Errors: errors.citizenship || [],
    Completed: completed.citizenship || []
  }
}

Citizenship.defaultProps = {
  section: 'citizenship',
  store: 'Citizenship',
  scrollToBottom: SectionView.BottomButtonsSelector
}

export class CitizenshipSections extends React.Component {
  render () {
    return (
      <div>
        <Status name="status"
          {...this.props.Status}
          defaultState={false}
          dispatch={this.props.dispatch}
          onError={this.props.onError}
          required={true}
          scrollIntoView={false}
        />

        <hr/>
        <Multiple name="multiple"
          {...this.props.Multiple}
          defaultState={false}
          dispatch={this.props.dispatch}
          onError={this.props.onError}
          required={true}
          scrollIntoView={false}
        />

        <hr/>
        <Passports name="passports"
          {...this.props.Passports}
          defaultState={false}
          dispatch={this.props.dispatch}
          onError={this.props.onError}
          required={true}
          scrollIntoView={false}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(AuthenticatedView(Citizenship))

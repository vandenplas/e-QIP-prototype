import React from 'react'
import { i18n } from '../../../../config'
import { Summary, DateSummary } from '../../../Summary'
import { ExistingConditionsValidator, ExistingConditionsDiagnosisValidator } from '../../../../validators'
import SubsectionElement from '../../SubsectionElement'
import { Accordion, Branch, Show, RadioGroup, Radio, Field, Textarea } from '../../../Form'
import Diagnosis from '../Diagnoses/Diagnosis'

export default class ExistingConditions extends SubsectionElement {
  constructor (props) {
    super(props)

    this.update = this.update.bind(this)
    this.updateHasCondition = this.updateHasCondition.bind(this)
    this.updateReceivedTreatment = this.updateReceivedTreatment.bind(this)
    this.updateTreatmentList = this.updateTreatmentList.bind(this)
    this.updateDidNotFollow = this.updateDidNotFollow.bind(this)
    this.updateExplanation = this.updateExplanation.bind(this)
    this.updateDidNotFollowExplanation = this.updateDidNotFollowExplanation.bind(this)
  }

  update (queue) {
    this.props.onUpdate({
      HasCondition: this.props.HasCondition,
      ReceivedTreatment: this.props.ReceivedTreatment,
      Explanation: this.props.Explanation,
      TreatmentList: this.props.TreatmentList,
      TreatmentListBranch: this.props.TreatmentListBranch,
      DidNotFollow: this.props.DidNotFollow,
      DidNotFollowExplanation: this.props.DidNotFollowExplanation,
      ...queue
    })
  }

  updateHasCondition (values) {
    this.update({
      HasCondition: values,
      ReceivedTreatment: values === 'Yes' ? this.props.ReceivedTreatment : '',
      Explanation: values === 'Yes' ? this.props.Explanation : {},
      TreatmentList: values === 'Yes' ? this.props.TreatmentList : [],
      TreatmentListBranch: values === 'Yes' ? this.props.TreatmentListBranch : '',
      DidNotFollow: values === 'Yes' ? this.props.DidNotFollow : '',
      DidNotFollowExplanation: values === 'Yes' ? this.props.DidNotFollowExplanation : {}
    })
  }

  updateReceivedTreatment (checkbox) {
    this.update({
      ReceivedTreatment: checkbox.value,
      Explanation: checkbox.value === 'No' ? this.props.Explanation : {}
    })
  }

  updateTreatmentList (values) {
    this.update({
      TreatmentList: values.items,
      TreatmentListBranch: values.branch
    })
  }

  updateDidNotFollow (values) {
    this.update({
      DidNotFollow: values,
      DidNotFollowExplanation: values === 'Yes' ? this.props.DidNotFollowExplanation : {}
    })
  }

  updateExplanation (values) {
    this.update({
      Explanation: values
    })
  }

  updateDidNotFollowExplanation (values) {
    this.update({
      DidNotFollowExplanation: values
    })
  }

  summary (item, index) {
    const o = (item || {}).Diagnosis || {}
    const treatmentDate = (o.Diagnosed || {})
    const date = DateSummary(treatmentDate)
    const condition = (o.Condition || {}).value || ''

    return Summary({
      type: i18n.t('psychological.existingConditions.treatment.collection.itemType'),
      index: index,
      left: condition,
      right: date,
      placeholder: i18n.m('psychological.existingConditions.treatment.collection.summary')
    })
  }

  render () {
    return (
      <div className="existingconditions">
        <Branch name="hascondition"
                label={i18n.t('psychological.existingConditions.heading.hasCondition')}
                labelSize="h2"
                className="eapp-field-wrap hascondition"
                value={this.props.HasCondition}
                warning={true}
                onError={this.handleError}
                required={this.props.required}
                scrollIntoView={this.props.scrollIntoView}
                onUpdate={this.updateHasCondition}>
          {i18n.m('psychological.existingConditions.para.hasCondition')}
        </Branch>

        <Show when={this.props.HasCondition === 'Yes'}>
          <div>
            <Field title={i18n.t('psychological.existingConditions.heading.receivedTreatment')}
                   titleSize="h3"
                   className={this.props.ReceivedTreatment === 'No' ? 'no-margin-bottom' : ''}
                   adjustFor="button"
                   scrollIntoView={this.props.scrollIntoView}>
              {i18n.m('psychological.existingConditions.para.receivedTreatment')}
              <RadioGroup className="treatment-list option-list" selectedValue={this.props.ReceivedTreatment} onError={this.handleError} required={this.props.required}>
                <Radio name="treatment"
                       className="treatment yes"
                       label={i18n.t('psychological.existingConditions.receivedTreatment.label.yes')}
                       value="Yes"
                       onUpdate={this.updateReceivedTreatment}
                       onError={this.handleError}
                       />
                <Radio name="treatment"
                       className="treatment no"
                       label={i18n.t('psychological.existingConditions.receivedTreatment.label.no')}
                       value="No"
                       onUpdate={this.updateReceivedTreatment}
                       onError={this.handleError}
                       />
                <Radio name="treatment"
                       className="treatment decline"
                       label={i18n.t('psychological.existingConditions.receivedTreatment.label.decline')}
                       value="Decline"
                       onUpdate={this.updateReceivedTreatment}
                       onError={this.handleError}
                       />
              </RadioGroup>
            </Field>

            <Show when={this.props.ReceivedTreatment === 'No'}>
              <Field title={i18n.t(`psychological.existingConditions.heading.explanation`)}
                     titleSize="label"
                     scrollIntoView={this.props.scrollIntoView}>
                <Textarea name="Explanation"
                          className="explanation existing-condition-explanation"
                          {...this.props.Explanation}
                          onUpdate={this.updateExplanation}
                          onError={this.handleError}
                          required={this.props.required}
                          />
              </Field>
            </Show>

            <Show when={this.props.ReceivedTreatment === 'Yes'}>
              <Accordion defaultState={this.props.defaultState}
                         items={this.props.TreatmentList}
                         branch={this.props.TreatmentListBranch}
                         onUpdate={this.updateTreatmentList}
                         summary={this.summary}
                         onError={this.handleError}
                         validator={ExistingConditionsDiagnosisValidator}
                         description={i18n.t('psychological.existingConditions.treatment.collection.description')}
                         appendTitle={i18n.t('psychological.existingConditions.treatment.collection.appendTitle')}
                         appendLabel={i18n.t('psychological.existingConditions.treatment.collection.appendLabel')}
                         required={this.props.required}
                         scrollIntoView={this.props.scrollIntoView}>
                <Diagnosis name="Item"
                           ApplicantBirthDate={this.props.ApplicantBirthDate}
                           prefix="existingConditions.diagnosis"
                           required={this.props.required}
                           scrollIntoView={this.props.scrollIntoView}
                           bind={true} />
              </Accordion>
            </Show>

            <Branch name="didNotFollow"
                    label={i18n.t('psychological.existingConditions.heading.didNotFollow')}
                    labelSize="h3"
                    className="eapp-field-wrap didnotfollow no-margin-bottom"
                    value={this.props.DidNotFollow}
                    onError={this.handleError}
                    required={this.props.required}
                    onUpdate={this.updateDidNotFollow}
                    scrollIntoView={this.props.scrollIntoView}>
            </Branch>

            <Show when={this.props.DidNotFollow === 'Yes'}>
              <Field title={i18n.t(`psychological.existingConditions.heading.didNotFollowExplanation`)}
                     titleSize="label"
                     scrollIntoView={this.props.scrollIntoView}>
                <Textarea name="DidNotFollowExplanation"
                          className="explanation existing-condition-didnotfollow-explanation"
                          {...this.props.DidNotFollowExplanation}
                          onUpdate={this.updateDidNotFollowExplanation}
                          onError={this.handleError}
                          required={this.props.required}
                          />
              </Field>
            </Show>
          </div>
        </Show>
      </div>
    )
  }
}

ExistingConditions.defaultProps = {
  TreatmentList: [],
  TreatmentListBranch: '',
  defaultState: true,
  onUpdate: (queue) => {},
  onError: (value, arr) => { return arr },
  section: 'psychological',
  subsection: 'conditions',
  dispatch: () => {},
  validator: (state, props) => {
    return new ExistingConditionsValidator(props, props).isValid()
  },
  prefix: 'existingConditions.diagnosis'
}

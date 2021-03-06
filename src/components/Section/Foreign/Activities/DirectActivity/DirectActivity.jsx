import React from 'react'
import { i18n } from '../../../../../config'
import { Summary } from '../../../../Summary'
import { Accordion, Branch, Show } from '../../../../Form'
import { ForeignDirectActivityValidator, ForeignDirectInterestValidator } from '../../../../../validators'
import SubsectionElement from '../../../SubsectionElement'
import DirectInterest from './DirectInterest'

export default class DirectActivity extends SubsectionElement {
  constructor (props) {
    super(props)

    this.update = this.update.bind(this)
    this.updateHasInterests = this.updateHasInterests.bind(this)
    this.updateList = this.updateList.bind(this)
  }

  update (queue) {
    this.props.onUpdate({
      HasInterests: this.props.HasInterests,
      List: this.props.List,
      ListBranch: this.props.ListBranch,
      ...queue
    })
  }

  updateList (values) {
    this.update({
      List: values.items,
      ListBranch: values.branch
    })
  }

  updateHasInterests (values) {
    this.update({
      HasInterests: values,
      List: values === 'Yes' ? this.props.List : [],
      ListBranch: values === 'Yes' ? this.props.ListBranch : ''
    })
  }

  summary (item, index) {
    const o = (item || {}).Item || {}
    const who = (o.InterestTypes || []).join(', ')
    const interestType = (o.InterestType || {}).value ? o.InterestType.value : ''
    const cost = (o.Cost || {}).value ? '$' + o.Cost.value : ''
    const summary = [who, interestType].reduce((prev, next) => {
      if (prev && next) {
        return prev + ' - ' + next
      }
      return prev
    })

    return Summary({
      type: i18n.t('foreign.activities.direct.collection.itemType'),
      index: index,
      left: summary,
      right: cost,
      placeholder: i18n.m('foreign.activities.direct.collection.summary')
    })
  }

  render () {
    return (
      <div className="direct">
        <Branch name="has_interests"
                label={i18n.t('foreign.activities.direct.heading.title')}
                labelSize="h2"
                value={this.props.HasInterests}
                help="foreign.activities.direct.help.directControl"
                warning={true}
                onError={this.handleError}
                required={this.props.required}
                onUpdate={this.updateHasInterests}
                scrollIntoView={this.props.scrollIntoView}>
          {i18n.m('foreign.activities.direct.para.intro')}
        </Branch>

        <Show when={this.props.HasInterests === 'Yes'}>
          <Accordion defaultState={this.props.defaultState}
                     items={this.props.List}
                     scrollToBottom={this.props.scrollToBottom}
                     branch={this.props.ListBranch}
                     summary={this.summary}
                     onUpdate={this.updateList}
                     onError={this.handleError}
                     validator={ForeignDirectInterestValidator}
                     description={i18n.t('foreign.activities.direct.collection.description')}
                     appendTitle={i18n.t('foreign.activities.direct.collection.appendTitle')}
                     appendLabel={i18n.t('foreign.activities.direct.collection.appendLabel')}
                     required={this.props.required}
                     scrollIntoView={this.props.scrollIntoView}>
            <DirectInterest name="Item"
                            addressBooks={this.props.addressBooks}
                            dispatch={this.props.dispatch}
                            bind={true}
                            required={this.props.required}
                            scrollIntoView={this.props.scrollIntoView}
                            />
          </Accordion>
        </Show>
      </div>
    )
  }
}

DirectActivity.defaultProps = {
  name: 'direct',
  HasInterests: '',
  List: [],
  ListBranch: '',
  defaultState: true,
  onUpdate: (queue) => {},
  onError: (value, arr) => { return arr },
  section: 'foreign',
  subsection: 'activities/direct',
  addressBooks: {},
  dispatch: (action) => {},
  validator: (state, props) => {
    return new ForeignDirectActivityValidator(state, props).isValid()
  }
}

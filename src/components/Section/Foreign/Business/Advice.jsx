import React from 'react'
import { i18n } from '../../../../config'
import { Summary, NameSummary } from '../../../Summary'
import { ForeignBusinessAdviceValidator, AdviceValidator } from '../../../../validators'
import SubsectionElement from '../../SubsectionElement'
import { Branch, Show, Accordion } from '../../../Form'
import AdviceItem from './AdviceItem'

export default class Advice extends SubsectionElement {
  constructor (props) {
    super(props)

    this.updateHasForeignAdvice = this.updateHasForeignAdvice.bind(this)
    this.updateList = this.updateList.bind(this)
  }

  update (queue) {
    this.props.onUpdate({
      List: this.props.List,
      ListBranch: this.props.ListBranch,
      HasForeignAdvice: this.props.HasForeignAdvice,
      ...queue
    })
  }

  updateHasForeignAdvice (value) {
    this.update({
      HasForeignAdvice: value,
      List: value === 'Yes' ? this.props.List : [],
      ListBranch: value === 'Yes' ? this.props.ListBranch : ''
    })
  }

  updateList (values) {
    this.update({
      List: values.items,
      ListBranch: values.branch
    })
  }

  summary (item, index) {
    const obj = ((item && item.Item) || {})
    const name = NameSummary(obj.Name)

    return Summary({
      type: i18n.t('foreign.business.advice.collection.summary.item'),
      index: index,
      left: name,
      right: null,
      placeholder: i18n.m('foreign.business.advice.collection.summary.unknown')
    })
  }

  render () {
    return (
      <div className="foreign-business-advice">
        <Branch name="has_foreign_advice"
                label={i18n.t('foreign.business.advice.heading.title')}
                labelSize="h2"
                adjustFor="p"
                value={this.props.HasForeignAdvice}
                warning={true}
                onUpdate={this.updateHasForeignAdvice}
                required={this.props.required}
                onError={this.handleError}
                scrollIntoView={this.props.scrollIntoView}>
          {i18n.m('foreign.business.advice.para.branch')}
        </Branch>

        <Show when={this.props.HasForeignAdvice === 'Yes'}>
          <Accordion items={this.props.List}
                     defaultState={this.props.defaultState}
                     scrollToBottom={this.props.scrollToBottom}
                     branch={this.props.ListBranch}
                     onUpdate={this.updateList}
                     onError={this.handleError}
                     validator={AdviceValidator}
                     summary={this.summary}
                     description={i18n.t('foreign.business.advice.collection.summary.title')}
                     appendTitle={i18n.t('foreign.business.advice.collection.appendTitle')}
                     appendMessage={i18n.m('foreign.business.advice.collection.appendMessage')}
                     appendLabel={i18n.t('foreign.business.advice.collection.append')}
                     required={this.props.required}
                     scrollIntoView={this.props.scrollIntoView}>
                     <AdviceItem
                       name="Item"
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

Advice.defaultProps = {
  name: 'Advice',
  HasForeignAdvice: '',
  List: [],
  ListBranch: '',
  onUpdate: (queue) => {},
  onError: (value, arr) => { return arr },
  section: 'foreign',
  subsection: 'business/advice',
  dispatch: () => {},
  validator: (state, props) => {
    return new ForeignBusinessAdviceValidator(props).isValid()
  },
  defaultState: true,
  scrollToBottom: ''
}

import React from 'react'
import { connect } from 'react-redux'
import { navigation } from '../../config'
import AuthenticatedView from '../../views/AuthenticatedView'

class ProgressBar extends React.Component {
  sections () {
    return navigation.filter(x => !x.hidden)
  }

  total () {
    return this.sections().length
  }

  completed () {
    const sections = this.sections()
    let completedSections = []

    for (let section in this.props.completed) {
      if (this.props.completed[section].status === 'complete'
          && !completedSections.includes(section)
          && sections.includes(section)) {
        completedSections.push(section)
      }
    }

    return completedSections.length
  }

  render () {
    const styles = {
      width: '' + ((this.completed() / this.total()) * 100) + '%'
    }

    return (
      <div className="eapp-progress">
        <div id="progress-bar" className="eapp-progress-current" style={styles}></div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  let section = state.section || {}
  let app = state.application || {}
  let completed = app.Completed || {}
  return {
    section: section,
    completed: completed
  }
}

export default connect(mapStateToProps)(AuthenticatedView(ProgressBar))

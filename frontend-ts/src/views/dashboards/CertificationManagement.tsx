import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';

import axios from 'axios';
import CircularLoader from 'src/components/ui-loader/CircularLoader';
import ICertification from 'src/models/certification';
import CertificationForm from 'src/views/forms/CertificationForm';

import dashboardStyles from 'src/styles/dashboard';


interface IProps extends WithStyles<typeof dashboardStyles> { }

interface IState {
  certifications: ICertification[];
  loading: boolean;
  newForm: boolean;
  openModal: boolean;
}

class CertificationManagement extends React.Component<IProps, IState> {
  public readonly state = {
    certifications: [],
    loading: false,
    newForm: true,
    openModal: false,
  };

  public fetchAndStoreCertifications = () => {
    this.setState(
      () => ({ loading: true }),
      () => axios.get('/api/certifications')
        .then(res => this.setState({
          certifications: res.data,
          loading: false,
        }))
        .catch(() => this.setState({ loading: false }))
    );
  }

  public componentDidMount() {
    this.fetchAndStoreCertifications();
  }

  public handleOpenNew = () => {
    this.setState({
      newForm: true,
      openModal: true,
    });
  }

  public handleClose = () => {
    this.setState({ openModal: false });
  }

  public render() {
    const { classes } = this.props;
    const { certifications, loading, newForm } = this.state;

    const certificationRows = certifications.map((certification: ICertification) => (
      <TableRow key={certification.id}>
        <TableCell>{certification.title}</TableCell>
      </TableRow>
    ));

    return (
      <React.Fragment>
        <Typography variant="h5">Certification Management</Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          onClick={this.handleOpenNew}
        >
          <AddIcon className={classes.iconRight} />
          Add New Certification
        </Button>
        <Paper className={classes.root}>
          {loading ? <CircularLoader /> : (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Certification Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificationRows}
              </TableBody>
            </Table>)}
        </Paper>
        <CertificationForm
          open={this.state.openModal}
          handleClose={this.handleClose}
          newForm={newForm}
          refreshTable={this.fetchAndStoreCertifications}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(dashboardStyles)(CertificationManagement);
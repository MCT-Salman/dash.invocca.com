import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const MuiStepper = ({
  activeStep = 0,
  steps = [], // array of strings or {label, optional}
  alternativeLabel = false,
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel={alternativeLabel}
      orientation={orientation}
      className={className}
      {...props}
    >
      {steps.map((step, index) => {
        const stepLabel = typeof step === 'string' ? step : step.label;
        const optional = typeof step === 'object' ? step.optional : false;

        return (
          <Step key={index}>
            <StepLabel
              optional={optional}
              StepIconProps={{
                className: '!text-secondary-500'
              }}
            >
              <span className="!text-primary-500 !font-medium">{stepLabel}</span>
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default MuiStepper;

/* packages */
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* store */
import { useAuthStore } from './store/authStore';

/* public */
import Home from './pages/public/Home';
import LogIn from './pages/public/LogIn';

/* components */
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectAuthenticatedUser from './components/RedirectAuthenticatedUser';

/* manager */
import ManagerDashboard from './pages/manager/ManagerDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ManagerSidebar from './pages/manager/ManagerSidebar';
import Search from './pages/manager/Search';

/* userlist */
import UserList from './pages/manager/user/UserList';
import AttendanceInfo from './pages/manager/user/AttendanceInfo';

/* payroll processing */
import SalaryComputation from './pages/manager/payroll/SalaryComputation';
import DeductionsManagement from './pages/manager/payroll/DeductionsManagement';
import PayrollDistribution from './pages/manager/payroll/PayrollDistribution';
import ComplianceTracking from './pages/manager/payroll/ComplianceTracking';
import RequestBudget from './pages/manager/payroll/RequestBudget';

/* benefits administration */
import BenefitsOverview from './pages/manager/benefits/BenefitsOverview';
import HealthBenefitsManagement from './pages/manager/Benefits/HealthBenefitsManagement';
import RetirementPlans from './pages/manager/Benefits/RetirementPlans';
import LeaveManagement from './pages/manager/Benefits/LeaveManagement';
import FlexibleBenefits from './pages/manager/Benefits/FlexibleBenefits';

/* incentives management */
import PerformanceBasedBonuses from './pages/manager/incentives/PerformanceBasedBonuses';
import RecognitionPrograms from './pages/manager/incentives/RecognitionPrograms';
import SalesCommissions from './pages/manager/incentives/SalesCommissions';
import ProfitSharing from './pages/manager/incentives/ProfitSharing';

/* compensation planning */
import SalaryPlanning from './pages/manager/compensation/SalaryPlanning';
import MarketAnalysis from './pages/manager/compensation/MarketAnalysis';
import EquityAdjustments from './pages/manager/compensation/EquityAdjustments';
import TotalRewards from './pages/manager/compensation/TotalRewards';

/* predictive analysis */
import EmployeeAnalytics from './pages/manager/predictive/EmployeeAnalytics';
import FinancialAnalytics from './pages/manager/predictive/FinancialAnalytics';
import OperationalAnalytics from './pages/manager/predictive/OperationAnalytics';

/* employee */
import EmployeeSidebar from './pages/employee/EmployeeSidebar';

import EBenefitsOverview from './pages/employee/benefits/EBenefitsOverview';
import BenefitsEnrollment from './pages/employee/Benefits Management/BenefitsEnrollment';
import ClaimsManagement from './pages/employee/Benefits Management/ClaimsManagement';
import BenefitStatements from './pages/employee/Benefits Management/BenefitStatements';
import SalaryProjections from './pages/employee/Compensation Planning Tools/SalaryProjections';
import EquityAdjustment from './pages/employee/Compensation Planning Tools/EquityAdjustment';
import LeaveBalances from './pages/employee/Leave Management/LeaveBalances';
import LeaveRequests from './pages/employee/Leave Management/LeaveRequests';
import LeaveHistory from './pages/employee/Leave Management/LeaveHistory';
import ImportantUpdates from './pages/employee/Notifications and Alerts/ImportantUpdates';
import PayStubs from './pages/employee/Payroll Information/PayStubs';
import TaxDocuments from './pages/employee/Payroll Information/TaxDocuments';
import DirectDeposit from './pages/employee/Payroll Information/DirectDeposit';
import SalaryDetails from './pages/employee/Personal Compensation Information/SalaryDetails';
import CompensationHistory from './pages/employee/Personal Compensation Information/CompensationHistory';
import UpdatePersonalInformation from './pages/employee/Personal Information Management/UpdatePersonalInformation';
import RetirementPlanOverview from './pages/employee/Retirement Plans/RetirementPlanOverview';
import BeneficiaryInformation from './pages/employee/Retirement Plans/BeneficiaryInformation';
import FAQs from './pages/employee/Support and Resources/FAQs';
import ContactHR from './pages/employee/Support and Resources/ContactHR';

const App = () => {
  const { checkAuth, isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth();
      setLoading(false);
    };
    authenticate();
  }, [checkAuth]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        {isAuthenticated ? (
          <>
            {user?.role === 'manager' ? <ManagerSidebar /> : <EmployeeSidebar />}
            <main className="flex-1 p-4 flex flex-col">
              <Search />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Navigate to={user?.role === 'manager' ? '/dashboard' : '/dashboard'} replace />} />
                  <Route path="/login" element={<RedirectAuthenticatedUser><LogIn /></RedirectAuthenticatedUser>} />

                  {user?.role === 'manager' && (
                    <>
                      <Route path="/dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
                      
                      {/* user list */}
                      <Route path="/user-list" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
                      <Route path="/attendance-info" element={<ProtectedRoute><AttendanceInfo /></ProtectedRoute>} />
                      
                      {/* payroll processing */}
                      <Route path="/salary-computation" element={<ProtectedRoute><SalaryComputation /></ProtectedRoute>} />
                      <Route path="/deductions-management" element={<ProtectedRoute><DeductionsManagement /></ProtectedRoute>} />
                      <Route path="/payroll-distribution" element={<ProtectedRoute><PayrollDistribution /></ProtectedRoute>} />
                      <Route path="/request-budget" element={<ProtectedRoute><RequestBudget /></ProtectedRoute>} />
                      <Route path="/compliance-tracking" element={<ProtectedRoute><ComplianceTracking /></ProtectedRoute>} />
                      
                      {/* benefits administration */}
                      <Route path="/benefits-overview" element={<ProtectedRoute><BenefitsOverview /></ProtectedRoute>} />
                      <Route path="/health-benefits-management" element={<ProtectedRoute><HealthBenefitsManagement /></ProtectedRoute>} />
                      <Route path="/retirement-plans" element={<ProtectedRoute><RetirementPlans /></ProtectedRoute>} />
                      <Route path="/leave-management" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
                      <Route path="/flexible-benefits" element={<ProtectedRoute><FlexibleBenefits /></ProtectedRoute>} />
                      
                      {/* incentives management */}
                      <Route path="/performance-based-bonuses" element={<ProtectedRoute><PerformanceBasedBonuses /></ProtectedRoute>} />
                      <Route path="/recognition-programs" element={<ProtectedRoute><RecognitionPrograms /></ProtectedRoute>} />
                      <Route path="/sales-commissions" element={<ProtectedRoute><SalesCommissions /></ProtectedRoute>} />
                      <Route path="/profit-sharing" element={<ProtectedRoute><ProfitSharing /></ProtectedRoute>} />
                      
                      {/* compensation */}
                      <Route path="/salary-planning" element={<ProtectedRoute><SalaryPlanning /></ProtectedRoute>} />
                      <Route path="/market-analysis" element={<ProtectedRoute><MarketAnalysis /></ProtectedRoute>} />
                      <Route path="/equity-adjustments" element={<ProtectedRoute><EquityAdjustments /></ProtectedRoute>} />
                      <Route path="/total-rewards" element={<ProtectedRoute><TotalRewards /></ProtectedRoute>} />
                      
                      {/* analytics */}
                      <Route path="/operational-analytics" element={<ProtectedRoute><OperationalAnalytics /></ProtectedRoute>} />
                      <Route path="/employee-analytics" element={<ProtectedRoute><EmployeeAnalytics /></ProtectedRoute>} />
                      <Route path="/financial-analytics" element={<ProtectedRoute><FinancialAnalytics /></ProtectedRoute>} />
                    </>
                  )}
                  
                  {user?.role === 'employee' && (
                    <>
                      <Route path="/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />                    
                      <Route path="/benefits-overview" element={<ProtectedRoute><EBenefitsOverview /></ProtectedRoute>} />                    
                      
                      <Route path="/benefits-enrollment" element={<ProtectedRoute><BenefitsEnrollment /></ProtectedRoute>} />                    
                      <Route path="/claims-management" element={<ProtectedRoute><ClaimsManagement /></ProtectedRoute>} />                    
                      <Route path="/benefit-statements" element={<ProtectedRoute><BenefitStatements /></ProtectedRoute>} />                    
                      
                      <Route path="/salary-projections" element={<ProtectedRoute><SalaryProjections /></ProtectedRoute>} />                    
                      <Route path="/equity-adjustment" element={<ProtectedRoute><EquityAdjustment /></ProtectedRoute>} />                    
                      
                      <Route path="/leave-balances" element={<ProtectedRoute><LeaveBalances /></ProtectedRoute>} />                    
                      <Route path="/leave-requests" element={<ProtectedRoute><LeaveRequests /></ProtectedRoute>} />                    
                      <Route path="/leave-history" element={<ProtectedRoute><LeaveHistory /></ProtectedRoute>} />                    
                      
                      <Route path="/important-updates" element={<ProtectedRoute><ImportantUpdates /></ProtectedRoute>} />                    
                      
                      <Route path="/pay-stubs" element={<ProtectedRoute><PayStubs /></ProtectedRoute>} />                    
                      <Route path="/tax-documents" element={<ProtectedRoute><TaxDocuments /></ProtectedRoute>} />                    
                      <Route path="/direct-deposit" element={<ProtectedRoute><DirectDeposit /></ProtectedRoute>} />                    
                      
                      <Route path="/salary-details" element={<ProtectedRoute><SalaryDetails /></ProtectedRoute>} />                    
                      <Route path="/compensation-history" element={<ProtectedRoute><CompensationHistory /></ProtectedRoute>} />                    
                      
                      <Route path="/update-info" element={<ProtectedRoute><UpdatePersonalInformation /></ProtectedRoute>} />                    
                      
                      <Route path="/retirement-overview" element={<ProtectedRoute><RetirementPlanOverview /></ProtectedRoute>} />                    
                      <Route path="/beneficiary-info" element={<ProtectedRoute><BeneficiaryInformation /></ProtectedRoute>} />                    
                      
                      <Route path="/faqs" element={<ProtectedRoute><FAQs /></ProtectedRoute>} />                    
                      <Route path="/contact-hr" element={<ProtectedRoute><ContactHR /></ProtectedRoute>} />                    
                    </>
                  )}

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default App;

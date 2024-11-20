import { Link } from 'react-router-dom';
import { FaChartLine, FaBalanceScale, FaUsers } from 'react-icons/fa';
import { AiOutlineStock, AiOutlineFundProjectionScreen } from 'react-icons/ai';
import { useEffect } from 'react';

const CompensationOverview = () => {
  useEffect(() => {
    document.title = 'Compensation Overview';
  }, []); 

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Compensation Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
                {/* Market Analysis Card */}
                <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Market Analysis</h2>
            <p>
              Compare salaries against market benchmarks to ensure competitive compensation packages.
            </p>
            <Link to="/market-analysis" className="btn btn-primary">
              <button>Perform Market Analysis</button>
            </Link>
          </div>
        </div>
        
        {/* Salary Planning Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Salary Planning</h2>
            <p>
              Plan and adjust employee salaries based on performance, market trends, and company policies.
            </p>
            <Link to="/compensation-planning" className="btn btn-primary">
              <button>Manage Salary Planning</button>
            </Link>
          </div>
        </div>

        {/* Salary Structure Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Salary Structure</h2>
            <p>
              Define and implement a structured salary system for all positions within the organization.
            </p>
            <Link to="/salary-structure" className="btn btn-primary">
              <button>View Salary Structure</button>
            </Link>
          </div>
        </div>

        {/* Grievance Request Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Grievance Request</h2>
            <p>
              Submit a request for compensation regarding grievances within the organization.
            </p>
            <Link to="/grievance-request" className="btn btn-primary">
              <button>Manage Grievance Requests</button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompensationOverview;

import React from 'react';
import { useGlobalState } from '../provider/global-state-provider';
import { Hourglass } from 'react-loader-spinner';

const Waiting = () => {
  const { presenterName } = useGlobalState();
  return (
    <div className="w-full h-full bg-gray-200/20 backdrop-blur-md p-4 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Hourglass
          visible={true}
          height="120"
          width="120"
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={['#88aaee', '#FD9745']}
        />
        <h2 className="text-gray-500 mt-5">
          {presenterName !== ''
            ? `${presenterName} is choosing a word...`
            : 'Joining Whiteboard...'}
        </h2>
      </div>
    </div>
  );
};

export default Waiting;

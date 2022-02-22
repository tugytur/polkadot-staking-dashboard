import { pageTitleFromUri } from '../../pages';
import Heading from './Heading';
import Definition from './Items/Definition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft as faBack } from '@fortawesome/free-solid-svg-icons';
import { ContentWrapper, ListWrapper, HeaderWrapper } from './Wrappers';
import { useConnect } from '../../contexts/Connect';
import { useLocation } from 'react-router-dom';
import { useAssistant } from '../../contexts/Assistant';
import { useModal } from '../../contexts/Modal';
import External from './Items/External';
import Action from './Items/Action';

export const Sections = (props: any) => {

  const { setActiveSection, pageMeta } = props;

  const connect = useConnect();
  const { pathname } = useLocation();
  const assistant = useAssistant();
  const modal = useModal();

  // connect handler
  const connectOnClick = () => {
    // close assistant
    assistant.toggle();
    // open connect
    modal.setStatus(1);
  }

  // resources to display
  const { definitions, external } = pageMeta;

  // external width patterns
  let curFlexWidth = 0;
  const flexWidths = [60, 40, 100, 50, 50,];

  // get definition
  const _innerDefinition = assistant.innerDefinition;
  let innerDefinition = {
    title: '',
    description: []
  };

  if (_innerDefinition.title !== undefined) {
    innerDefinition.title = _innerDefinition.title;
    innerDefinition.description = _innerDefinition.description;
  }

  return (
    <>
      <ContentWrapper>
        <HeaderWrapper>
          <div className='hold'>
            <h3>{pageTitleFromUri(pathname)} Resources</h3>
            <span>
              <button className='close' onClick={() => { assistant.toggle() }}>
                Close
              </button>
            </span>
          </div>
        </HeaderWrapper>
        <ListWrapper>

          {/* only display if accounts not yet connected */}
          {connect.status === 0 &&
            <Action
              height="120px"
              label='next step'
              title='Connect Your Accounts'
              subtitle="Connect your Polkadot accounts to start staking."
              onClick={connectOnClick}
            />
          }

          {/* Display definitions */}
          {definitions.length > 0 &&
            <>
              <Heading title="Definitions" />
              {definitions.map((item: any, index: number) =>
                <Definition
                  key={`def_${index}`}
                  onClick={() => {
                    assistant.setInnerDefinition(item);
                    setActiveSection(1);
                  }}
                  title={item.title}
                  description={item.description}
                />
              )}
            </>
          }

          {/* Display external */}
          {external.length > 0 &&
            <>
              <Heading title="Articles" />
              {external.map((item: any, index: number) => {

                const thisRteturn: any = <External
                  key={`ext_${index}`}
                  width={flexWidths[curFlexWidth]}
                  label={item.label}
                  title={item.title}
                  subtitle={item.subtitle}
                  url={item.url}
                />;

                curFlexWidth = curFlexWidth > (flexWidths.length - 1)
                  ? 0
                  : curFlexWidth + 1;

                return thisRteturn;
              })}
            </>
          }

        </ListWrapper>
      </ContentWrapper>

      <ContentWrapper>
        <HeaderWrapper>
          <div className='hold'>
            <button onClick={() => setActiveSection(0)}>
              <FontAwesomeIcon
                icon={faBack}
                transform="shrink-4"
                style={{ cursor: 'pointer', marginRight: '0.3rem' }}
              /> Back
            </button>

            <span>
              <button className='close' onClick={() => { assistant.toggle() }}>Close</button>
            </span>
          </div>
        </HeaderWrapper>
        <ListWrapper>
          <h2>{innerDefinition.title}</h2>
          {innerDefinition.description.map((item, index) =>
            <p key={`inner_def_${index}`} className='definition'>
              {item}
            </p>
          )}
        </ListWrapper>
      </ContentWrapper>
    </>
  )
}

export default Sections;
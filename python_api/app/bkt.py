import pandas as pd
import numpy as np

# params
INIT = 'init'
TRANSFER = 'trasfer'
SLIP = 'slip'
GUESS = 'guess'

# terms
CONCEPT = 'concept'
EID = "eid"
UID = 'uid'
STEP = 'step'
CORRECT = 'correct'
IS_READ = 'is_read'


def posterior_pknown(is_correct, eid, transfer, item_params, prior_pknown):
    """
    updates BKT estimate of learner knowledge

    Parameters
    ----------
    result: boolean
        True if response was correct
    eid: String
        exercise ID
    transfer: float
        transfer probability for concept
    item_params: pd.DataFrame
        slip and guess parameters for each item
    prior_pknown: float
        prior probability user learned this concept (read, write are different concepts)
    """
    if not eid in item_params[EID].unique():
        raise Exception(
            'Given exercise ID not in response data. Return w/ no update. EID is {}'.format(eid))
        return prior_pknown

    posterior = -1.0

    # .iloc[0] added to get 1st one (just in case exercise ID duplicated to handle error condition where exercise is read & write)
    slip = float(item_params[item_params[EID] == eid][SLIP].iloc[0]) 
    guess = float(item_params[item_params[EID] == eid][GUESS].iloc[0])

    if is_correct:
        posterior = (prior_pknown * (1.0 - slip)) / ((prior_pknown * (1 - slip)) + ((1.0-prior_pknown)*guess))
    else:
        posterior = (prior_pknown * slip) / ((prior_pknown * slip) + ((1.0-prior_pknown)*(1.0-guess)))
    
    return (posterior + (1.0-posterior) * transfer)


def pknown_seq(uid, concept, df_opp, concept_params, item_params, is_read=True):
    """
    Predict sequence of probability a concept is known after each step.
    Function not used in real-time, but may be used to batch update pknown (e.g. if concept or exercise params updated)
    
    Parameters
    ----------
    uid: String
        learner/user ID
    concept: String
        concept name
    df_opp: pd.DataFrame
        dataframe which records the correctness of responses for users. columns: uid, eid, step, correct
    concept_params: pd.DataFrame
        concept parameters (concept, init, transfer)
    item_params: pd.DataFrame
        item parameters (eid, slip, guess, concept)
    is_read: Boolean
        True if concept relates to reading, False if it relates to writing
    """
    
    eids = item_params[(item_params[CONCEPT] == concept) & (item_params[IS_READ] == is_read)][EID]
    
    # grab exercise sequence for specific user working on specific concept
    exercise_seq = df_opp[(df_opp[UID] == uid) & (df_opp[EID].isin(eids))]
    
    n_opps = len(exercise_seq) # number exercises attempted
    
    # filtering for 1 concept to update
    concept_params_target = concept_params[(concept_params[CONCEPT] == concept) & (concept_params[IS_READ] == is_read)]
    
    pk = pd.Series(np.zeros(n_opps + 1))    
    pk[0] = float(concept_params_target[INIT])
    
    if(n_opps > 0):
        transfer = float(concept_params_target[TRANSFER])        
        
        for step in range(1,n_opps+1):
            df_step = exercise_seq[exercise_seq[STEP]==step]
            if(len(df_step) != 1):
                raise Exception('Did not find exactly 1 response for user {} for step {}. Found {}'
                                .format(uid, step, len(df_step)))

            is_correct = df_step.iloc[0][CORRECT]
            eid = df_step.iloc[0][EID]
            
            pk[step] = posterior_pknown(is_correct, eid, transfer, item_params, pk[step - 1])
    return pk


def pcorrect(pk, slip, guess):
    return (pk * (1.0-slip)) + ((1.0 - pk) * guess)


def pcorrect_seq(uid, concept, df_opp, concept_params, item_params, is_read=True):
    """
    Probability of correct responses predicted by BKT.
    
    Parameters
    ----------
    uid: String
        learner/user ID
    concept: String
        concept name
    df_opp: pd.DataFrame
        dataframe which records the correctness of responses for users. columns: uid, eid, step, correct
    concept_params: pd.DataFrame
        concept parameters (concept, init, transfer)
    item_params: pd.DataFrame
        item parameters (eid, slip, guess, concept)
    is_read: Boolean
        True if concept relates to reading, False if it relates to writing    
    """
    eids = item_params[item_params[CONCEPT] == concept][EID]
    
    # grab exercise sequence for specific user working on specific concept
    exercise_seq = df_opp[(df_opp[UID] == uid) & (df_opp[EID].isin(eids))]    
    n_opps = len(exercise_seq) # number exercises attempted

    pk = pknown_seq(uid, concept, df_opp, concept_params, item_params, is_read)
    pc = pd.Series(np.zeros(n_opps))
    for step in range(0,len(pc)):
        eid = exercise_seq.iloc[step][EID]
        slip = float(item_params[item_params[EID] == eid][SLIP])
        guess = float(item_params[item_params[EID] == eid][GUESS])
        pc[step] = pcorrect(pk[step], slip, guess)

    return pc


def order_next_questions(exercise_ids, pk, item_params, error = 0.0, penalty = 1.0):
    """
    Order questions based on "most answerable." 
    Exercise IDs and probability of known must be of same concept, either read or write.
    
    Parameters
    ----------
    exercise_ids: list
        list of exercise ids (Strings) for same concept
    pk: float
        probability concept is known
    item_params: pd.DataFrame
        item parameters (eid, slip, guess, concept)
    """
    df_output = pd.DataFrame({"eid": exercise_ids, "score": np.zeros(len(exercise_ids))})
    df_item_params = pd.DataFrame.from_dict(item_params)
    
    # get max and min scores/p(correct)
    for eid in exercise_ids:
        if eid in df_item_params:
            params = df_item_params[df_item_params[EID] == eid].iloc[0]
            df_output.loc[df_output[EID] == eid, 'score'] = pcorrect(pk, params[SLIP], params[GUESS])

    min_score = min(df_output['score'])
    max_score = max(df_output['score'])
    target_score = min_score + ((max_score - min_score) * (1 - pk + error))
    
    df_output['diff'] = abs(df_output['score'] - target_score) * penalty
    
    return list(df_output.sort_values(by='diff')[EID])
